---
title: Testing Strategy
type: wiki
status: active
updated: 2026-06-15
owners: []
confidence: high
---

# Testing Strategy

## What this page explains

This page explains current test coverage and the gaps that matter for future
changes.

## Summary

The project uses Node's built-in `node:test` runner. Current tests cover profile
path safety and CDP debugger URL rewriting. The highest-value next tests are an
integration test with a fake Chrome discovery server and a WebSocket upgrade
tunnel test.

## Current Coverage

| Area | Evidence | Notes |
|---|---|---|
| Profile validation | `test/profiles.test.js` | Verifies traversal-like names are rejected. |
| Profile path mapping | `test/profiles.test.js` | Verifies named profiles live under `.pw-cdp-broker/profiles`. |
| CDP URL rewriting | `test/server.test.js` | Verifies browser/page URLs and `wss` behavior. |

## Known Gaps

- No end-to-end test launching a real Chrome executable.
- No fake-Chrome integration test for `/json/version`.
- No WebSocket upgrade tunnel test.
- No SSH tunnel process argument test.

## Sources

- Raw: `../../raw/codebase/tests/unit-test-inventory.md`
- Raw: `../../raw/codebase/e2e/e2e-scenario-map.md`
- Tests: `../../../test/profiles.test.js`
- Tests: `../../../test/server.test.js`
- Code: `../../../package.json`
