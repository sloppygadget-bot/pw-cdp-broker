---
title: NFR Overview
type: wiki
status: active
updated: 2026-06-15
owners: []
confidence: high
---

# NFR Overview

## Summary

The project's most important non-functional concerns are security and
reliability. The broker exposes control of a local browser, and persistent
profiles store sensitive auth state. Reliability depends on Chrome launch,
CDP readiness, URL rewriting correctness, and stable WebSocket tunneling.

## NFR Pages

- [Security](security.md)
- [Reliability](reliability.md)
- [Observability](observability.md)

## Current Evidence

| NFR | Evidence | Status |
|---|---|---|
| Security | `src/profiles.js`, `src/cli.js`, `src/server.js` | Basic local defaults and profile validation exist; no broker auth. |
| Reliability | `src/chrome.js`, `src/cli.js`, tests | Chrome readiness polling and unit-tested URL rewriting exist. |
| Observability | `src/cli.js`, `src/server.js` | Terminal logs and `/healthz`; no structured metrics. |

## Sources

- Raw: `../../raw/codebase/nfr/security-surface.md`
- Raw: `../../raw/codebase/nfr/observability-inventory.md`
- Code: `../../../src/cli.js`
- Code: `../../../src/server.js`
- Code: `../../../src/profiles.js`
