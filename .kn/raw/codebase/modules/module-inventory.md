---
title: Module Inventory
type: raw-module-inventory
generated: 2026-06-16T00:00:00Z
commit: none
command: "manual scan of working tree after standby lifecycle implementation"
sources:
  - bin/pw-cdp-broker.js
  - src/browser-manager.js
  - src/chrome.js
  - src/cli.js
  - src/profiles.js
  - src/proxy-forwards.js
  - src/server.js
  - test/browser-manager.test.js
  - test/chrome.test.js
  - test/cli.test.js
  - test/profiles.test.js
  - test/proxy-forwards.test.js
  - test/server.test.js
  - package.json
  - README.md
---

# Module Inventory

The repository is a dependency-free Node.js ES module CLI.

| Path | Role | Notes |
|---|---|---|
| `bin/pw-cdp-broker.js` | CLI executable | Imports `main()` and maps thrown errors to stderr/process exit. |
| `src/browser-manager.js` | Browser lifecycle | Starts/stops broker-owned Chrome instances, rejects active profile-dir reuse, and tracks instance metadata. |
| `src/cli.js` | Process orchestration | Parses flags, creates browser manager, starts broker server, optionally starts OpenSSH reverse tunnel. |
| `src/chrome.js` | Chrome runtime utilities | Builds Chrome flags, finds executable, allocates a free port, waits for `/json/version`. |
| `src/profiles.js` | Profile path policy | Validates named profiles and maps them under `~/.pw-cdp-broker/profiles/`. |
| `src/proxy-forwards.js` | Managed proxy forwards | Creates/lists/deletes SSH local forwards that browser instances can reference by `proxyForwardId`. |
| `src/server.js` | Control and CDP proxy server | Serves lifecycle/proxy/help routes, proxies HTTP discovery, and tunnels WebSocket upgrades to Chrome instances. |
| `test/browser-manager.test.js` | Unit tests | Covers remote lifecycle launch options, required profile validation, and stop behavior. |
| `test/chrome.test.js` | Unit tests | Covers Chrome proxy/TLS argument construction. |
| `test/cli.test.js` | Unit tests | Covers CLI parsing and SSH argument construction. |
| `test/profiles.test.js` | Unit tests | Covers profile name validation and profile directory mapping. |
| `test/proxy-forwards.test.js` | Unit tests | Covers proxy-forward SSH args, create/list/delete, conflict, and in-use behavior. |
| `test/server.test.js` | Unit tests | Covers CDP `webSocketDebuggerUrl` rewriting and lifecycle control HTTP behavior. |
| `package.json` | Package metadata | Defines ESM mode, bin entry, `start`, and `test` scripts. |
| `README.md` | User docs | Documents MFA workflow, SSH tunnel usage, persistent profiles, and CLI options. |

## Framework Hints

- Runtime: Node.js >= 18.
- Test runner: built-in `node:test`.
- External npm dependencies: none.
