---
title: ADR Index
type: wiki
status: active
updated: 2026-06-15
owners: []
confidence: medium
---

# ADR Index

## Recorded Decisions

| Decision | Status | Evidence |
|---|---|---|
| Use Chrome-compatible CDP discovery rather than a custom `/endpoint`. | accepted | `src/server.js`, `README.md`, user direction in conversation. |
| Use named profiles mapped under `~/.pw-cdp-broker/profiles/<name>`. | accepted | `src/profiles.js`, `README.md`. |
| Do not store SSH passwords in the broker. Delegate reuse to OpenSSH ControlPersist. | accepted | `src/cli.js`, `README.md`. |
| Keep implementation dependency-free for now. | accepted | `package.json`, `src/server.js`. |

## Sources

- Code: `../../../src/server.js`
- Code: `../../../src/profiles.js`
- Code: `../../../src/cli.js`
- Docs: `../../../README.md`
- Raw: `../../raw/codebase/dependencies/package-dependency-report.md`
