---
title: Testing Strategy
type: wiki
status: active
updated: 2026-06-16
owners: []
confidence: high
---

# Testing Strategy

## What this page explains

This page explains current test coverage and the gaps that matter for future
changes.

## Summary

The project uses Node's built-in `node:test` runner. Current tests cover profile
path safety, CDP debugger URL rewriting, CLI argument parsing, Chrome launch
argument construction, and the broker-managed browser lifecycle contract. The
highest-value next tests are an integration test with a fake Chrome discovery
server and a WebSocket upgrade tunnel test.

## Current Coverage

| Area | Evidence | Notes |
|---|---|---|
| Profile validation | `test/profiles.test.js` | Verifies traversal-like names are rejected. |
| Profile path mapping | `test/profiles.test.js` | Verifies named profiles live under `.pw-cdp-broker/profiles`. |
| CDP URL rewriting | `test/server.test.js` | Verifies browser/page URLs and `wss` behavior. |
| Lifecycle control | `test/browser-manager.test.js`, `test/server.test.js` | Verifies start/stop API shape, standby behavior, instruction endpoints, instance URL rewriting, and launch options. |
| CLI options | `test/cli.test.js`, `test/chrome.test.js` | Verifies proxy/TLS/standby parsing, SSH args, and Chrome arg construction. |

## Known Gaps

- No end-to-end test launching a real Chrome executable.
- No fake-Chrome integration test for `/json/version`.
- No WebSocket upgrade tunnel test.
- No real process integration test for `/_broker/start`.

## Sources

- Raw: `../../raw/codebase/tests/unit-test-inventory.md`
- Raw: `../../raw/codebase/e2e/e2e-scenario-map.md`
- Tests: `../../../test/profiles.test.js`
- Tests: `../../../test/server.test.js`
- Tests: `../../../test/browser-manager.test.js`
- Tests: `../../../test/cli.test.js`
- Tests: `../../../test/chrome.test.js`
- Code: `../../../package.json`
