---
title: Package Dependency Report
type: raw-dependency-report
generated: 2026-06-15T00:00:00Z
commit: none
command: "manual package.json inspection"
sources:
  - package.json
---

# Package Dependency Report

`package.json` declares no runtime or development dependencies.

Runtime requirements:

- Node.js >= 18.
- A local Chrome/Chromium-compatible executable.
- OpenSSH client only when `--ssh` tunnel mode is used.

Scripts:

| Script | Command | Purpose |
|---|---|---|
| `start` | `node bin/pw-cdp-broker.js` | Run the broker CLI. |
| `test` | `node --test` | Run Node built-in tests. |
