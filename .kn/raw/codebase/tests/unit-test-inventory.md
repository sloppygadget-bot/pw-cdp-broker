---
title: Unit Test Inventory
type: raw-test-inventory
generated: 2026-06-16T00:00:00Z
commit: none
command: "npm test"
sources:
  - test/profiles.test.js
  - test/server.test.js
  - test/browser-manager.test.js
  - test/chrome.test.js
  - test/cli.test.js
---

# Unit Test Inventory

| Test File | Scenario | Covered Source | Notes |
|---|---|---|---|
| `test/browser-manager.test.js` | `starts Chrome from remote lifecycle options` | `src/browser-manager.js`, `src/chrome.js`, `src/profiles.js` | Verifies profile mapping, proxy/TLS args, port readiness wait, and spawn call. |
| `test/browser-manager.test.js` | `requires a profile when no default profile or user data dir is configured` | `src/browser-manager.js` | Verifies standby start requires a remote profile unless constrained by startup config. |
| `test/browser-manager.test.js` | `stops the active Chrome instance` | `src/browser-manager.js` | Verifies instance-matched stop kills the child and clears active state. |
| `test/chrome.test.js` | `adds proxy and SSL launch options before extra Chrome args` | `src/chrome.js` | Verifies launch-time proxy, bypass, and certificate flags. |
| `test/cli.test.js` | `parses proxy and SSL options` | `src/cli.js` | Verifies proxy/TLS options are parsed. |
| `test/cli.test.js` | `parses SSH proxy forwarding options` | `src/cli.js` | Verifies remote/local SSH proxy forward flags are parsed. |
| `test/cli.test.js` | `parses quiet option` | `src/cli.js` | Verifies quiet mode parsing. |
| `test/cli.test.js` | `parses standby option` | `src/cli.js` | Verifies standby mode parsing. |
| `test/cli.test.js` | `builds SSH args with reverse broker tunnel and local proxy forward` | `src/cli.js` | Verifies SSH `-R`, `-L`, and ControlPersist args. |
| `test/profiles.test.js` | `validates safe profile names` | `src/profiles.js` | Verifies allowed profile names and rejects traversal/empty names. |
| `test/profiles.test.js` | `maps profile names under broker home` | `src/profiles.js`, `src/chrome.js` | Verifies named profile path ends under `.pw-cdp-broker/profiles/`. |
| `test/server.test.js` | `rewrites browser and page websocket debugger urls to broker origin` | `src/server.js` | Verifies recursive CDP URL rewriting. |
| `test/server.test.js` | `uses wss when broker origin is https` | `src/server.js` | Verifies secure broker origins produce `wss` debugger URLs. |
| `test/server.test.js` | `rewrites debugger urls under an instance-scoped broker path` | `src/server.js` | Verifies instance path is preserved in rewritten WebSocket URLs. |
| `test/server.test.js` | `start control route returns an instance-scoped CDP URL` | `src/server.js` | Verifies `POST /_broker/start` response shape and manager delegation. |
| `test/server.test.js` | `returns 503 for CDP discovery before Chrome is started` | `src/server.js` | Verifies standby discovery failure mode. |
| `test/server.test.js` | `serves remote Playwright instructions over the broker endpoint` | `src/server.js` | Verifies `/_broker/instructions` returns Markdown integration instructions. |
| `test/server.test.js` | `serves a copyable Playwright broker client helper` | `src/server.js` | Verifies `/_broker/client.js` returns helper source. |

Latest observed result:

```text
npm test
tests 18
pass 18
fail 0
```

Coverage gaps:

- No integration test with a fake Chrome HTTP server.
- No WebSocket upgrade tunnel test.
- No CLI process lifecycle test.
- No real Chrome launch test.
