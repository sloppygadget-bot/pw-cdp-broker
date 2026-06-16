import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';

import { createBrokerServer, rewriteDebuggerUrls } from '../src/server.js';

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

test('rewrites debugger urls under an instance-scoped broker path', () => {
  const payload = {
    webSocketDebuggerUrl: 'ws://127.0.0.1:41235/devtools/browser/abc',
  };

  assert.equal(
    rewriteDebuggerUrls(
      payload,
      'http://127.0.0.1:18080/_broker/instances/bkr_abc'
    ).webSocketDebuggerUrl,
    'ws://127.0.0.1:18080/_broker/instances/bkr_abc/devtools/browser/abc'
  );
});

test('start control route returns an instance-scoped CDP URL', async () => {
  const starts = [];
  const server = createBrokerServer({
    browserManager: {
      activeInstance: () => undefined,
      listInstances: () => [],
      start: async (options) => {
        starts.push(options);
        return {
          id: 'bkr_abc',
          profile: 'work-okta',
          chromeHost: '127.0.0.1',
          chromePort: 9333,
          pid: 123,
          startedAt: '2026-06-16T00:00:00.000Z',
        };
      },
    },
  });

  const { port, close } = await listen(server);
  try {
    const response = await requestJson({
      port,
      method: 'POST',
      path: '/_broker/start',
      body: {
        profile: 'work-okta',
        proxyServer: 'http://127.0.0.1:18899',
        ignoreSslErrors: true,
      },
    });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(starts, [
      {
        profile: 'work-okta',
        proxyServer: 'http://127.0.0.1:18899',
        ignoreSslErrors: true,
      },
    ]);
    assert.equal(response.body.ok, true);
    assert.equal(response.body.instanceId, 'bkr_abc');
    assert.equal(
      response.body.cdpUrl,
      `http://127.0.0.1:${port}/_broker/instances/bkr_abc`
    );
  } finally {
    await close();
  }
});

test('returns 503 for CDP discovery before Chrome is started', async () => {
  const server = createBrokerServer({
    browserManager: {
      activeInstance: () => undefined,
      listInstances: () => [],
    },
  });

  const { port, close } = await listen(server);
  try {
    const response = await requestJson({
      port,
      method: 'GET',
      path: '/json/version',
    });

    assert.equal(response.statusCode, 503);
    assert.equal(response.body.ok, false);
    assert.match(response.body.error, /Chrome is not running/);
  } finally {
    await close();
  }
});

test('serves remote Playwright instructions over the broker endpoint', async () => {
  const server = createBrokerServer({
    browserManager: {
      activeInstance: () => undefined,
      listInstances: () => [],
    },
  });

  const { port, close } = await listen(server);
  try {
    const response = await requestText({
      port,
      method: 'GET',
      path: '/_broker/instructions',
    });

    assert.equal(response.statusCode, 200);
    assert.match(response.headers['content-type'], /text\/markdown/);
    assert.match(response.body, /POST \/_broker\/start|_broker\/start/);
    assert.match(response.body, /connectOverCDP\(start\.cdpUrl\)/);
  } finally {
    await close();
  }
});

test('serves a copyable Playwright broker client helper', async () => {
  const server = createBrokerServer({
    browserManager: {
      activeInstance: () => undefined,
      listInstances: () => [],
    },
  });

  const { port, close } = await listen(server);
  try {
    const response = await requestText({
      port,
      method: 'GET',
      path: '/_broker/client.js',
    });

    assert.equal(response.statusCode, 200);
    assert.match(response.headers['content-type'], /text\/javascript/);
    assert.match(response.body, /export async function connectViaBroker/);
    assert.match(response.body, /chromium\.connectOverCDP\(instance\.cdpUrl\)/);
  } finally {
    await close();
  }
});

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject);
      const address = server.address();
      resolve({
        port: address.port,
        close: () => new Promise((closeResolve) => server.close(closeResolve)),
      });
    });
  });
}

function requestText({ port, method, path }) {
  return new Promise((resolve, reject) => {
    const request = http.request(
      {
        host: '127.0.0.1',
        port,
        path,
        method,
      },
      (response) => {
        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', () => {
          resolve({
            statusCode: response.statusCode,
            headers: response.headers,
            body,
          });
        });
      }
    );
    request.once('error', reject);
    request.end();
  });
}

function requestJson({ port, method, path, body }) {
  return new Promise((resolve, reject) => {
    const payload = body === undefined ? undefined : JSON.stringify(body);
    const request = http.request(
      {
        host: '127.0.0.1',
        port,
        path,
        method,
        headers: payload
          ? {
              'content-type': 'application/json',
              'content-length': Buffer.byteLength(payload),
            }
          : undefined,
      },
      (response) => {
        let responseBody = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          responseBody += chunk;
        });
        response.on('end', () => {
          resolve({
            statusCode: response.statusCode,
            body: responseBody ? JSON.parse(responseBody) : undefined,
          });
        });
      }
    );
    request.once('error', reject);
    if (payload) request.write(payload);
    request.end();
  });
}
