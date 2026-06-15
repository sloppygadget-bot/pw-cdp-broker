---
title: Module Inventory
type: raw-module-inventory
generated: 2026-06-15T00:00:00Z
commit: none
command: "manual scan of working tree after initial implementation"
sources:
  - bin/pw-cdp-broker.js
  - src/chrome.js
  - src/cli.js
  - src/profiles.js
  - src/server.js
  - test/profiles.test.js
  - test/server.test.js
  - package.json
  - README.md
---

# Module Inventory

The repository is a dependency-free Node.js ES module CLI.

| Path | Role | Notes |
|---|---|---|
| `bin/pw-cdp-broker.js` | CLI executable | Imports `main()` and maps thrown errors to stderr/process exit. |
| `src/cli.js` | Process orchestration | Parses flags, launches Chrome, starts broker server, optionally starts OpenSSH reverse tunnel. |
| `src/chrome.js` | Chrome runtime utilities | Builds Chrome flags, finds executable, allocates a free port, waits for `/json/version`. |
| `src/profiles.js` | Profile path policy | Validates named profiles and maps them under `~/.pw-cdp-broker/profiles/`. |
| `src/server.js` | CDP proxy server | Proxies HTTP discovery to Chrome and tunnels WebSocket upgrades to Chrome. |
| `test/profiles.test.js` | Unit tests | Covers profile name validation and profile directory mapping. |
| `test/server.test.js` | Unit tests | Covers CDP `webSocketDebuggerUrl` rewriting. |
| `package.json` | Package metadata | Defines ESM mode, bin entry, `start`, and `test` scripts. |
| `README.md` | User docs | Documents MFA workflow, SSH tunnel usage, persistent profiles, and CLI options. |

## Framework Hints

- Runtime: Node.js >= 18.
- Test runner: built-in `node:test`.
- External npm dependencies: none.
