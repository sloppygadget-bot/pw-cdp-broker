---
title: HTTP Route Map
type: raw-api-map
generated: 2026-06-15T00:00:00Z
commit: none
command: "manual route scan of src/server.js"
sources:
  - src/server.js
  - README.md
---

# HTTP Route Map

The broker exposes Chrome-compatible CDP discovery and WebSocket paths.

| Method | Path | Handler | Behavior |
|---|---|---|---|
| `GET` | `/` | `createBrokerServer` | Returns JSON health/status. |
| `GET` | `/healthz` | `createBrokerServer` | Returns JSON health/status. |
| `GET` | `/json/version` | `proxyHttpRequest` | Proxies to Chrome and rewrites `webSocketDebuggerUrl`. |
| `GET` | `/json` | `proxyHttpRequest` | Proxies to Chrome and rewrites debugger URLs in JSON payload. |
| `GET` | `/json/list` | `proxyHttpRequest` | Proxies to Chrome and rewrites debugger URLs in JSON payload. |
| `GET` | other paths | `proxyHttpRequest` | Proxies to Chrome; rewrites JSON payloads when parseable. |
| `Upgrade` | `/devtools/browser/<id>` | `proxyUpgrade` | Opens TCP connection to Chrome and tunnels the WebSocket upgrade stream. |
| `Upgrade` | `/devtools/page/<id>` | `proxyUpgrade` | Opens TCP connection to Chrome and tunnels the WebSocket upgrade stream. |

Non-GET HTTP methods receive `405 Method Not Allowed`.
