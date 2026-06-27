import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildSshArgs,
  buildSshControlCheckArgs,
  buildSshControlMasterArgs,
  parseArgs,
} from '../src/cli.js';

test('parses proxy and SSL options', () => {
  assert.deepEqual(
    parseArgs([
      '--proxy-server',
      'http://127.0.0.1:8899',
      '--proxy-bypass-list=<-loopback>',
      '--ignore-ssl-errors',
    ]),
    {
      chromeArg: [],
      proxyServer: 'http://127.0.0.1:8899',
      proxyBypassList: '<-loopback>',
      ignoreSslErrors: true,
    }
  );
});

test('parses SSH proxy forwarding options', () => {
  assert.deepEqual(
    parseArgs([
      '--ssh',
      'user@code-server',
      '--ssh-proxy-remote-port',
      '8899',
      '--ssh-proxy-local-port=18899',
    ]),
    {
      chromeArg: [],
      ssh: 'user@code-server',
      sshProxyRemotePort: '8899',
      sshProxyLocalPort: '18899',
    }
  );
});

test('parses quiet option', () => {
  assert.deepEqual(parseArgs(['--quiet']), {
    chromeArg: [],
    quiet: true,
  });
});

test('parses standby option', () => {
  assert.deepEqual(parseArgs(['--standby']), {
    chromeArg: [],
    standby: true,
  });
});

test('builds SSH args with reverse broker tunnel and local proxy forward', () => {
  assert.deepEqual(
    buildSshArgs({
      target: 'user@code-server',
      localPort: 18080,
      remotePort: 18080,
      controlPersist: '24h',
      controlPath: '/tmp/control-%C',
      proxyForward: {
        localPort: 18899,
        remotePort: 8899,
      },
    }),
    [
      '-o',
      'ControlMaster=auto',
      '-o',
      'ControlPersist=24h',
      '-o',
      'ControlPath=/tmp/control-%C',
      '-o',
      'ExitOnForwardFailure=yes',
      '-L',
      '18899:localhost:8899',
      '-N',
      '-R',
      '18080:localhost:18080',
      'user@code-server',
    ]
  );
});

test('builds SSH control master check args', () => {
  assert.deepEqual(
    buildSshControlCheckArgs({
      target: 'user@code-server',
      controlPath: '/tmp/control-%C',
    }),
    ['-o', 'ControlPath=/tmp/control-%C', '-O', 'check', 'user@code-server']
  );
});

test('builds detached SSH control master args', () => {
  assert.deepEqual(
    buildSshControlMasterArgs({
      target: 'user@code-server',
      controlPersist: '12h',
      controlPath: '/tmp/control-%C',
    }),
    [
      '-o',
      'ControlMaster=yes',
      '-o',
      'ControlPersist=12h',
      '-o',
      'ControlPath=/tmp/control-%C',
      '-M',
      '-N',
      '-f',
      'user@code-server',
    ]
  );
});
