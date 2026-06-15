import http from 'node:http';
import net from 'node:net';
import { URL } from 'node:url';

export function createBrokerServer({ chromeHost, chromePort }) {
  const server = http.createServer(async (req, res) => {
    try {
      if (req.method !== 'GET') {
        res.writeHead(405, { allow: 'GET' });
        res.end('Method Not Allowed');
        return;
      }

      if (req.url === '/' || req.url === '/healthz') {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ ok: true, chrome: `${chromeHost}:${chromePort}` }));
        return;
      }

      await proxyHttpRequest({ req, res, chromeHost, chromePort });
    } catch (error) {
      res.writeHead(502, { 'content-type': 'text/plain' });
      res.end(error?.message || 'Bad Gateway');
    }
  });

  server.on('upgrade', (req, socket, head) => {
    proxyUpgrade({ req, socket, head, chromeHost, chromePort });
  });

  return server;
}

export function rewriteDebuggerUrls(value, brokerOrigin) {
  if (Array.isArray(value)) {
    return value.map((item) => rewriteDebuggerUrls(item, brokerOrigin));
  }
  if (!value || typeof value !== 'object') {
    return value;
  }

  const rewritten = {};
  for (const [key, child] of Object.entries(value)) {
    if (
      typeof child === 'string' &&
      (key === 'webSocketDebuggerUrl' || key.endsWith('WebSocketDebuggerUrl'))
    ) {
      rewritten[key] = rewriteWebSocketUrl(child, brokerOrigin);
    } else {
      rewritten[key] = rewriteDebuggerUrls(child, brokerOrigin);
    }
  }
  return rewritten;
}

function rewriteWebSocketUrl(rawUrl, brokerOrigin) {
  const source = new URL(rawUrl);
  const broker = new URL(brokerOrigin);
  source.protocol = broker.protocol === 'https:' ? 'wss:' : 'ws:';
  source.hostname = broker.hostname;
  source.port = broker.port;
  return source.toString();
}

async function proxyHttpRequest({ req, res, chromeHost, chromePort }) {
  const body = await requestChrome({
    req,
    chromeHost,
    chromePort,
  });

  const contentType = body.headers['content-type'] || '';
  const shouldRewrite =
    req.url === '/json/version' ||
    req.url === '/json' ||
    req.url === '/json/list' ||
    contentType.includes('application/json');

  if (!shouldRewrite) {
    res.writeHead(body.statusCode, body.headers);
    res.end(body.buffer);
    return;
  }

  let payload;
  try {
    payload = JSON.parse(body.buffer.toString('utf8'));
  } catch {
    res.writeHead(body.statusCode, body.headers);
    res.end(body.buffer);
    return;
  }

  const brokerOrigin = requestOrigin(req);
  const rewritten = rewriteDebuggerUrls(payload, brokerOrigin);
  const responseBody = Buffer.from(JSON.stringify(rewritten, null, 2));
  res.writeHead(body.statusCode, {
    ...body.headers,
    'content-type': 'application/json; charset=utf-8',
    'content-length': responseBody.length,
  });
  res.end(responseBody);
}

function requestChrome({ req, chromeHost, chromePort }) {
  return new Promise((resolve, reject) => {
    const headers = { ...req.headers, host: `${chromeHost}:${chromePort}` };
    const request = http.request(
      {
        host: chromeHost,
        port: chromePort,
        method: req.method,
        path: req.url,
        headers,
      },
      (response) => {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          resolve({
            statusCode: response.statusCode || 502,
            headers: response.headers,
            buffer: Buffer.concat(chunks),
          });
        });
      }
    );
    request.once('error', reject);
    req.pipe(request);
  });
}

function proxyUpgrade({ req, socket, head, chromeHost, chromePort }) {
  const upstream = net.connect(chromePort, chromeHost);

  upstream.once('connect', () => {
    upstream.write(buildUpgradeRequest(req, chromeHost, chromePort));
    if (head?.length) upstream.write(head);
    socket.pipe(upstream);
    upstream.pipe(socket);
  });

  upstream.once('error', (error) => {
    if (!socket.destroyed) {
      socket.write('HTTP/1.1 502 Bad Gateway\r\n\r\n');
      socket.destroy(error);
    }
  });

  socket.once('error', () => {
    upstream.destroy();
  });
}

function buildUpgradeRequest(req, chromeHost, chromePort) {
  const lines = [`${req.method} ${req.url} HTTP/${req.httpVersion}`];
  const rawHeaders = req.rawHeaders || [];
  let wroteHost = false;
  for (let i = 0; i < rawHeaders.length; i += 2) {
    const name = rawHeaders[i];
    const value = rawHeaders[i + 1];
    if (name.toLowerCase() === 'host') {
      lines.push(`Host: ${chromeHost}:${chromePort}`);
      wroteHost = true;
    } else {
      lines.push(`${name}: ${value}`);
    }
  }
  if (!wroteHost) lines.push(`Host: ${chromeHost}:${chromePort}`);
  return `${lines.join('\r\n')}\r\n\r\n`;
}

function requestOrigin(req) {
  const host = req.headers.host;
  const encrypted = Boolean(req.socket.encrypted);
  return `${encrypted ? 'https' : 'http'}://${host}`;
}
