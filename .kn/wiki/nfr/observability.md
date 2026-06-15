---
title: Observability
type: wiki
status: active
updated: 2026-06-15
owners: []
confidence: high
---

# Observability

## Summary

Observability is terminal-oriented. The CLI prints launch paths, profile paths,
broker URL, Playwright connection hint, SSH tunnel mapping, and unexpected child
process exits. The broker exposes `/healthz`.

## Current Signals

- Launch-time Chrome executable and profile path.
- Broker listen URL.
- Remote Playwright connection hint.
- SSH target, port mapping, and ControlPersist value.
- Unexpected Chrome and SSH exits.
- HTTP proxy errors as `502`.

## Gaps

- No structured logs.
- No connection/request counts.
- No debug logging for individual CDP WebSocket sessions.

## Sources

- Raw: `../../raw/codebase/nfr/observability-inventory.md`
- Code: `../../../src/cli.js`
- Code: `../../../src/server.js`
