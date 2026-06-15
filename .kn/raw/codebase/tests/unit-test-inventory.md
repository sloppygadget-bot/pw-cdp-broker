---
title: Unit Test Inventory
type: raw-test-inventory
generated: 2026-06-15T00:00:00Z
commit: none
command: "npm test"
sources:
  - test/profiles.test.js
  - test/server.test.js
---

# Unit Test Inventory

| Test File | Scenario | Covered Source | Notes |
|---|---|---|---|
| `test/profiles.test.js` | `validates safe profile names` | `src/profiles.js` | Verifies allowed profile names and rejects traversal/empty names. |
| `test/profiles.test.js` | `maps profile names under broker home` | `src/profiles.js`, `src/chrome.js` | Verifies named profile path ends under `.pw-cdp-broker/profiles/`. |
| `test/server.test.js` | `rewrites browser and page websocket debugger urls to broker origin` | `src/server.js` | Verifies recursive CDP URL rewriting. |
| `test/server.test.js` | `uses wss when broker origin is https` | `src/server.js` | Verifies secure broker origins produce `wss` debugger URLs. |

Latest observed result:

```text
npm test
tests 4
pass 4
fail 0
```

Coverage gaps:

- No integration test with a fake Chrome HTTP server.
- No WebSocket upgrade tunnel test.
- No CLI process lifecycle test.
- No SSH tunnel argument-construction test.
