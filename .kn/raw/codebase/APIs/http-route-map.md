---
title: HTTP Route Map
type: raw-api-map
generated: 2026-06-16T00:00:00Z
commit: none
command: "manual route scan of src/server.js"
sources:
  - src/server.js
  - src/browser-manager.js
  - README.md
---

# HTTP Route Map

The broker exposes broker lifecycle control endpoints plus Chrome-compatible
CDP discovery and WebSocket paths. Root CDP paths route to the active browser
instance; instance-scoped paths route by `instanceId`.

| Method | Path | Handler | Behavior |
|---|---|---|---|
| `GET` | `/` | `createBrokerServer` | Returns JSON health/status. |
| `GET` | `/healthz` | `createBrokerServer` | Returns JSON health/status. |
| `GET` | `/_broker/help` | `handleControlRequest` | Returns Markdown help for remote Playwright agents. |
| `GET` | `/_broker/instructions` | `handleControlRequest` | Compatibility alias for `/_broker/help`. |
| `GET` | `/_broker/client.js` | `handleControlRequest` | Returns copyable JavaScript helper source for remote Playwright clients. |
| `GET` | `/_broker/status` | `handleControlRequest` | Returns running state, all instance metadata, and proxy-forward metadata. |
| `POST` | `/_broker/start` | `handleControlRequest` | Starts Chrome through `browserManager.start()` and returns `{ instanceId, cdpUrl }`; accepts `proxyForwardId`. |
| `POST` | `/_broker/stop` | `handleControlRequest` | Stops the requested Chrome instance; `instanceId` is required when more than one is running. |
| `POST` | `/_broker/profiles/clear` | `handleControlRequest` | Clears a named broker-managed persistent profile when no active instance uses it. |
| `GET` | `/_broker/proxy-forwards` | `handleControlRequest` | Lists managed SSH proxy forwards. |
| `POST` | `/_broker/proxy-forwards` | `handleControlRequest` | Creates an SSH local forward and returns `{ forwardId, proxyServer }`. |
| `DELETE` | `/_broker/proxy-forwards/<id>` | `handleControlRequest` | Deletes an unused proxy forward. |
| `GET` | `/json/version` | `proxyHttpRequest` | Proxies to Chrome and rewrites `webSocketDebuggerUrl`. |
| `GET` | `/json` | `proxyHttpRequest` | Proxies to Chrome and rewrites debugger URLs in JSON payload. |
| `GET` | `/json/list` | `proxyHttpRequest` | Proxies to Chrome and rewrites debugger URLs in JSON payload. |
| `GET` | `/_broker/instances/<id>/json/version` | `proxyHttpRequest` | Proxies to the matching instance and rewrites debugger URLs under the instance path. |
| `GET` | `/_broker/instances/<id>/json` | `proxyHttpRequest` | Proxies target discovery for the matching instance. |
| `GET` | `/_broker/instances/<id>/json/list` | `proxyHttpRequest` | Proxies target discovery for the matching instance. |
| `GET` | other paths | `proxyHttpRequest` | Proxies to Chrome; rewrites JSON payloads when parseable. |
| `Upgrade` | `/devtools/browser/<id>` | `proxyUpgrade` | Opens TCP connection to Chrome and tunnels the WebSocket upgrade stream. |
| `Upgrade` | `/devtools/page/<id>` | `proxyUpgrade` | Opens TCP connection to Chrome and tunnels the WebSocket upgrade stream. |
| `Upgrade` | `/_broker/instances/<id>/devtools/browser/<id>` | `proxyUpgrade` | Routes WebSocket upgrade to the matching instance. |
| `Upgrade` | `/_broker/instances/<id>/devtools/page/<id>` | `proxyUpgrade` | Routes page WebSocket upgrade to the matching instance. |

Non-GET HTTP methods on CDP paths receive `405 Method Not Allowed`. Root CDP
discovery returns `503` when no browser is running and `409` when multiple
instances make root routing ambiguous.
