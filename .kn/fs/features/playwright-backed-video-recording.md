---
title: Playwright-Backed Video Recording
type: feature-spec
status: roadmap
updated: 2026-06-16
feature_owner: unknown
confidence: medium
---

# Roadmap: Playwright-Backed Video Recording

## Summary

Broker-controlled persistent Chrome sessions do not currently support standard
Playwright video recording. A future design can make the broker launch Chrome
through Playwright `chromium.launchPersistentContext(userDataDir, { recordVideo })`
so recording is enabled when the persistent context is created.

## Intended Direction

- Add an optional Playwright-backed launch mode for instances that request video.
- Keep remote automation through broker-returned CDP URLs.
- Store video artifacts on the broker host first, then expose list/download
  endpoints if remote clients need to retrieve them.
- Validate that Playwright-launched persistent contexts can still expose a
  Chrome-compatible remote debugging port for remote `connectOverCDP`.

## Non-Goals For Current Implementation

- No video recording for existing broker-controlled persistent contexts.
- No remote artifact download API.
- No change to screenshot support; remote Playwright screenshots remain supported.

## Sources

- Docs: `../../../README.md`
- Code: `../../../src/browser-manager.js`
- Code: `../../../src/server.js`
