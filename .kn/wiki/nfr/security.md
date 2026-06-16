---
title: Security
type: wiki
status: active
updated: 2026-06-16
owners: []
confidence: high
---

# Security

## Summary

The broker controls a local Chrome session and therefore should normally remain
bound to loopback or reachable only through a trusted tunnel. Standby control
endpoints can start and stop local Chrome, so unauthenticated use should be
limited to localhost/SSH-trusted workflows. Named profiles are validated to
prevent path traversal and are stored under broker-owned profile storage. SSH
passwords are not handled by the broker; OpenSSH owns prompts and ControlPersist
reuse.

## Current Controls

- Default broker bind host is `127.0.0.1`.
- Named profiles reject empty names, traversal separators, `.` and `..`.
- Instance-scoped CDP URLs include a random instance ID for routing and stale-client safety.
- SSH uses native `ssh` with `ControlMaster=auto` and `ControlPersist=24h`.
- No npm dependencies reduce third-party package surface.

## Known Risks

- No app-level broker authentication exists for lifecycle control endpoints.
- `--host 0.0.0.0` can expose browser control to the network.
- Persistent Chrome profiles contain sensitive cookies/session storage.
- `--user-data-dir` accepts an explicit operator-provided path.

## Sources

- Raw: `../../raw/codebase/nfr/security-surface.md`
- Code: `../../../src/cli.js`
- Code: `../../../src/profiles.js`
- Code: `../../../src/server.js`
- Code: `../../../src/browser-manager.js`
- Docs: `../../../README.md`
