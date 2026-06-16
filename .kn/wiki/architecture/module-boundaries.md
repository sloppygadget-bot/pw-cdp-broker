---
title: Module Boundaries
type: wiki
status: active
updated: 2026-06-16
owners: []
confidence: high
---

# Module Boundaries

## What this page explains

This page documents the major modules and the intended ownership boundaries.

## Summary

The codebase is intentionally small and dependency-free. `src/cli.js` owns
process lifecycle and command-line behavior. `src/browser-manager.js` owns
broker-managed Chrome instance lifecycle. `src/proxy-forwards.js` owns
SSH-backed proxy forward lifecycle. `src/server.js` owns control routes, CDP
proxy behavior, and instance path routing, while delegating Chrome process and
proxy-forward lifecycle to those managers. `src/chrome.js` owns Chrome-specific
executable, argument, port, and readiness helpers. `src/profiles.js` owns
profile name validation and profile path mapping.

## Dependency Map

```mermaid
flowchart TD
  bin["bin/pw-cdp-broker.js"] --> cli["src/cli.js"]
  cli --> server["src/server.js"]
  cli --> manager["src/browser-manager.js"]
  cli --> proxyForwards["src/proxy-forwards.js"]
  server --> manager
  server --> proxyForwards
  manager --> chrome["src/chrome.js"]
  manager --> profiles["src/profiles.js"]
  proxyForwards --> chrome
  cli --> chrome["src/chrome.js"]
  cli --> profiles["src/profiles.js"]
```

## Important Code Paths

| Path | Boundary | Stable Responsibility |
|---|---|---|
| `bin/pw-cdp-broker.js` | Entrypoint | Execute CLI and convert uncaught errors to process failures. |
| `src/cli.js` | Application orchestration | Configure and connect Chrome, broker server, and optional SSH tunnel. |
| `src/browser-manager.js` | Browser lifecycle | Start, stop, and describe broker-owned Chrome instances. |
| `src/proxy-forwards.js` | Proxy lifecycle | Start, stop, and describe broker-owned SSH proxy forwards. |
| `src/server.js` | Control and protocol proxy | Preserve Chrome-compatible CDP surface and route instance-scoped paths. |
| `src/chrome.js` | Browser runtime | Produce Chrome launch args and detect readiness. |
| `src/profiles.js` | Profile path policy | Keep named profiles inside broker-owned storage. |

## Related Feature Specs

- [Chrome-Compatible CDP Broker](../../fs/features/chrome-compatible-cdp-broker.md)
- [Managed Proxy Forwards](../../fs/features/managed-proxy-forwards.md)
- [Persistent Browser Profiles](../../fs/features/persistent-browser-profiles.md)
- [Remote Browser Lifecycle Control](../../fs/features/remote-browser-lifecycle-control.md)

## Sources

- Raw: `../../raw/codebase/modules/module-inventory.md`
- Raw: `../../raw/codebase/dependencies/import-graph.mmd`
- Code: `../../../bin/pw-cdp-broker.js`
- Code: `../../../src/cli.js`
- Code: `../../../src/server.js`
- Code: `../../../src/browser-manager.js`
- Code: `../../../src/proxy-forwards.js`
- Code: `../../../src/chrome.js`
- Code: `../../../src/profiles.js`
