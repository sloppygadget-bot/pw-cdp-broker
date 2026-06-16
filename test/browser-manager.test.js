import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import test from 'node:test';

import { createBrowserManager } from '../src/browser-manager.js';

function fakeChild() {
  const child = new EventEmitter();
  child.killed = false;
  child.kill = (signal) => {
    child.killed = true;
    child.signal = signal;
    child.emit('exit', null, signal);
  };
  return child;
}

test('starts Chrome from remote lifecycle options', async () => {
  const child = fakeChild();
  const spawned = [];
  const waited = [];
  const manager = createBrowserManager({
    chromeExecutable: '/bin/chrome',
    spawnImpl: (file, args, options) => {
      spawned.push({ file, args, options });
      return child;
    },
    getFreePortImpl: async () => 9333,
    waitForChromeImpl: async (options) => {
      waited.push(options);
    },
    quiet: true,
  });

  const instance = await manager.start({
    profile: 'work-okta',
    proxyServer: 'http://127.0.0.1:18899',
    proxyBypassList: '<-loopback>',
    ignoreSslErrors: true,
  });

  assert.match(instance.id, /^bkr_/);
  assert.equal(instance.profile, 'work-okta');
  assert.equal(instance.chromeHost, '127.0.0.1');
  assert.equal(instance.chromePort, 9333);
  assert.equal(spawned[0].file, '/bin/chrome');
  assert.deepEqual(waited, [{ host: '127.0.0.1', port: 9333 }]);
  assert.ok(spawned[0].args.includes('--proxy-server=http://127.0.0.1:18899'));
  assert.ok(spawned[0].args.includes('--proxy-bypass-list=<-loopback>'));
  assert.ok(spawned[0].args.includes('--ignore-certificate-errors'));
  assert.ok(spawned[0].args.some((arg) => arg.startsWith('--user-data-dir=')));
});

test('requires a profile when no default profile or user data dir is configured', async () => {
  const manager = createBrowserManager({
    chromeExecutable: '/bin/chrome',
    spawnImpl: () => fakeChild(),
    getFreePortImpl: async () => 9333,
    waitForChromeImpl: async () => {},
    quiet: true,
  });

  await assert.rejects(() => manager.start({}), /profile is required/);
});

test('stops the active Chrome instance', async () => {
  const child = fakeChild();
  const manager = createBrowserManager({
    chromeExecutable: '/bin/chrome',
    spawnImpl: () => child,
    getFreePortImpl: async () => 9333,
    waitForChromeImpl: async () => {},
    quiet: true,
  });

  const instance = await manager.start({ profile: 'work-okta' });
  const result = await manager.stop({ instanceId: instance.id });

  assert.deepEqual(result, { stopped: true, instanceId: instance.id });
  assert.equal(child.killed, true);
  assert.equal(manager.activeInstance(), undefined);
});
