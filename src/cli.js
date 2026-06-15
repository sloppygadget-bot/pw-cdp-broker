import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { createBrokerServer } from './server.js';
import {
  buildChromeArgs,
  findChromeExecutable,
  getFreePort,
  waitForChrome,
} from './chrome.js';
import { profileDirForName, validateProfileName } from './profiles.js';

const DEFAULT_BROKER_PORT = 18080;
const DEFAULT_PROFILE = 'default';
const DEFAULT_SSH_CONTROL_PERSIST = '24h';

export async function main(argv) {
  const options = parseArgs(argv);

  if (options.help) {
    printHelp();
    return;
  }

  if (options.profile && options.userDataDir) {
    throw new Error('--profile and --user-data-dir are mutually exclusive');
  }

  const brokerPort = Number(options.port ?? DEFAULT_BROKER_PORT);
  assertPort(brokerPort, '--port');

  const chromeDebugPort = options.chromePort
    ? Number(options.chromePort)
    : await getFreePort('127.0.0.1');
  assertPort(chromeDebugPort, '--chrome-port');

  const userDataDir = options.userDataDir
    ? path.resolve(options.userDataDir)
    : profileDirForName(options.profile ?? DEFAULT_PROFILE);

  if (options.profile) {
    validateProfileName(options.profile);
  }

  if (options.resetProfile) {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
  fs.mkdirSync(userDataDir, { recursive: true });

  const chromeExecutable =
    options.chromeExecutable || findChromeExecutable(process.env.CHROME_PATH);
  if (!chromeExecutable) {
    throw new Error(
      'Could not find Chrome/Chromium. Pass --chrome-executable or set CHROME_PATH.'
    );
  }

  const chromeArgs = buildChromeArgs({
    remoteDebuggingPort: chromeDebugPort,
    userDataDir,
    headless: Boolean(options.headless),
    extraArgs: options.chromeArg,
  });

  const children = new Set();
  let server;
  let shuttingDown = false;

  const shutdown = async (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    if (signal) console.log(`Received ${signal}; shutting down.`);
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    for (const child of children) {
      if (!child.killed) child.kill('SIGTERM');
    }
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));

  console.log(`Launching Chrome: ${chromeExecutable}`);
  console.log(`Chrome profile: ${userDataDir}`);
  const chrome = spawn(chromeExecutable, chromeArgs, {
    stdio: ['ignore', 'inherit', 'inherit'],
  });
  children.add(chrome);
  chrome.on('exit', (code, signal) => {
    children.delete(chrome);
    if (!shuttingDown) {
      console.error(`Chrome exited unexpectedly: code=${code} signal=${signal}`);
      void shutdown();
    }
  });

  await waitForChrome({ host: '127.0.0.1', port: chromeDebugPort });

  server = createBrokerServer({
    chromeHost: '127.0.0.1',
    chromePort: chromeDebugPort,
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(brokerPort, options.host ?? '127.0.0.1', () => {
      server.off('error', reject);
      resolve();
    });
  });

  const address = server.address();
  const listenHost =
    typeof address === 'object' && address ? address.address : options.host ?? '127.0.0.1';
  console.log(`CDP broker listening: http://${listenHost}:${brokerPort}`);
  console.log(`Remote Playwright: chromium.connectOverCDP('http://127.0.0.1:${brokerPort}')`);

  if (options.ssh) {
    const ssh = startSshTunnel({
      target: options.ssh,
      localPort: brokerPort,
      remotePort: Number(options.sshRemotePort ?? brokerPort),
      controlPersist: options.sshControlPersist ?? DEFAULT_SSH_CONTROL_PERSIST,
    });
    children.add(ssh);
    ssh.on('exit', (code, signal) => {
      children.delete(ssh);
      if (!shuttingDown) {
        console.error(`ssh tunnel exited: code=${code} signal=${signal}`);
      }
    });
  }
}

export function parseArgs(argv) {
  const options = {
    chromeArg: [],
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--headless') {
      options.headless = true;
    } else if (arg === '--reset-profile') {
      options.resetProfile = true;
    } else if (arg.startsWith('--')) {
      const [name, inlineValue] = arg.split('=', 2);
      const value = inlineValue ?? argv[++i];
      if (value === undefined) throw new Error(`${name} requires a value`);
      switch (name) {
        case '--port':
          options.port = value;
          break;
        case '--host':
          options.host = value;
          break;
        case '--chrome-port':
          options.chromePort = value;
          break;
        case '--profile':
          options.profile = value;
          break;
        case '--user-data-dir':
          options.userDataDir = value;
          break;
        case '--chrome-executable':
          options.chromeExecutable = value;
          break;
        case '--chrome-arg':
          options.chromeArg.push(value);
          break;
        case '--ssh':
          options.ssh = value;
          break;
        case '--ssh-remote-port':
          options.sshRemotePort = value;
          break;
        case '--ssh-control-persist':
          options.sshControlPersist = value;
          break;
        default:
          throw new Error(`Unknown option: ${name}`);
      }
    } else {
      throw new Error(`Unexpected argument: ${arg}`);
    }
  }

  return options;
}

function assertPort(port, name) {
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`${name} must be a TCP port between 1 and 65535`);
  }
}

function startSshTunnel({ target, localPort, remotePort, controlPersist }) {
  assertPort(remotePort, '--ssh-remote-port');
  const controlDir = path.join(os.homedir(), '.pw-cdp-broker', 'ssh');
  fs.mkdirSync(controlDir, { recursive: true, mode: 0o700 });

  const args = [
    '-o',
    'ControlMaster=auto',
    '-o',
    `ControlPersist=${controlPersist}`,
    '-o',
    `ControlPath=${path.join(controlDir, '%C')}`,
    '-N',
    '-R',
    `${remotePort}:localhost:${localPort}`,
    target,
  ];

  console.log(`Starting SSH reverse tunnel: ${target} remote ${remotePort} -> local ${localPort}`);
  console.log(`SSH ControlPersist: ${controlPersist}`);
  return spawn('ssh', args, { stdio: 'inherit' });
}

function printHelp() {
  console.log(`pw-cdp-broker

Launch a local visible Chrome and expose a Chrome-compatible CDP endpoint for
remote Playwright clients.

Usage:
  pw-cdp-broker [options]

Options:
  --port <port>                 Broker CDP port. Default: ${DEFAULT_BROKER_PORT}
  --host <host>                 Broker listen host. Default: 127.0.0.1
  --profile <name>              Named broker profile. Default: ${DEFAULT_PROFILE}
  --user-data-dir <path>        Explicit Chrome profile path; exclusive with --profile
  --reset-profile               Delete the selected profile before launch
  --chrome-port <port>          Chrome remote debugging port. Default: random free port
  --chrome-executable <path>    Chrome/Chromium executable path
  --chrome-arg <arg>            Extra Chrome arg; repeatable
  --headless                    Launch Chrome headless
  --ssh <user@host>             Start an SSH reverse tunnel to a code-server host
  --ssh-remote-port <port>      Remote tunnel port. Default: same as --port
  --ssh-control-persist <time>  OpenSSH ControlPersist value. Default: 24h
  --help                        Show this help

Examples:
  pw-cdp-broker --profile work-okta
  pw-cdp-broker --profile work-okta --ssh user@code-server

Remote Playwright:
  await chromium.connectOverCDP('http://127.0.0.1:${DEFAULT_BROKER_PORT}');
`);
}
