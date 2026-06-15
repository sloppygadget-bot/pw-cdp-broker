import assert from 'node:assert/strict';
import test from 'node:test';

import { rewriteDebuggerUrls } from '../src/server.js';

test('rewrites browser and page websocket debugger urls to broker origin', () => {
  const payload = {
    webSocketDebuggerUrl: 'ws://127.0.0.1:41235/devtools/browser/abc',
    pages: [
      {
        webSocketDebuggerUrl: 'ws://127.0.0.1:41235/devtools/page/def',
      },
    ],
  };

  assert.deepEqual(rewriteDebuggerUrls(payload, 'http://127.0.0.1:18080'), {
    webSocketDebuggerUrl: 'ws://127.0.0.1:18080/devtools/browser/abc',
    pages: [
      {
        webSocketDebuggerUrl: 'ws://127.0.0.1:18080/devtools/page/def',
      },
    ],
  });
});

test('uses wss when broker origin is https', () => {
  const payload = {
    webSocketDebuggerUrl: 'ws://127.0.0.1:41235/devtools/browser/abc',
  };

  assert.equal(
    rewriteDebuggerUrls(payload, 'https://broker.example.test').webSocketDebuggerUrl,
    'wss://broker.example.test/devtools/browser/abc'
  );
});
