---
title: Build And Runtime Inventory
type: raw-runtime-inventory
generated: 2026-06-15T00:00:00Z
commit: none
command: "manual runtime scan"
sources:
  - package.json
  - src/cli.js
  - src/chrome.js
  - README.md
---

# Build And Runtime Inventory

## Runtime

- Node.js ES modules (`"type": "module"`).
- Node.js >= 18.
- No transpilation or build step.

## Local Process Topology

1. `node bin/pw-cdp-broker.js` starts the CLI.
2. The CLI launches Chrome with a random or configured CDP port.
3. The CLI waits for Chrome `/json/version`.
4. The broker HTTP server listens on `--host`/`--port`.
5. Optional OpenSSH reverse tunnel maps remote port to local broker port.

## External Executables

| Executable | Required | Purpose |
|---|---|---|
| Chrome/Chromium | Yes | Visible browser controlled by remote Playwright over CDP. |
| `ssh` | Only with `--ssh` | Reverse tunnel and OpenSSH `ControlPersist=24h` reuse. |
