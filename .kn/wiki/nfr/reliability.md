---
title: Reliability
type: wiki
status: active
updated: 2026-06-15
owners: []
confidence: medium
---

# Reliability

## Summary

The broker waits for Chrome CDP readiness before listening and shuts down child
processes on SIGINT/SIGTERM. URL rewriting is unit tested. WebSocket tunneling
is implemented as a raw TCP upgrade proxy but does not yet have automated
integration coverage.

## Current Evidence

- `waitForChrome()` polls `/json/version` before server startup.
- Chrome and SSH child process exits are observed.
- `rewriteDebuggerUrls()` is unit tested for broker host and protocol rewrite.

## Known Gaps

- No test covers Chrome process launch on each supported OS.
- No test covers WebSocket upgrade tunneling.
- No reconnect/retry behavior exists for an SSH tunnel that exits.

## Sources

- Code: `../../../src/cli.js`
- Code: `../../../src/chrome.js`
- Code: `../../../src/server.js`
- Tests: `../../../test/server.test.js`
- Raw: `../../raw/codebase/tests/unit-test-inventory.md`
