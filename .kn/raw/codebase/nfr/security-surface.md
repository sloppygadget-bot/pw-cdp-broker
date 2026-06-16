---
title: Security Surface
type: raw-nfr-security
generated: 2026-06-16T00:00:00Z
commit: none
command: "manual NFR scan"
sources:
  - src/browser-manager.js
  - src/cli.js
  - src/profiles.js
  - src/server.js
  - README.md
---

# Security Surface

Security-sensitive areas:

| Area | Evidence | Current Behavior | Risk |
|---|---|---|---|
| Browser profile persistence | `src/profiles.js`, `src/browser-manager.js` | Named profiles are stored under `~/.pw-cdp-broker/profiles/<name>`. | Profile stores cookies/session data and must be treated as sensitive local state. |
| Profile name traversal | `src/profiles.js` | Names limited to letters, numbers, dot, underscore, dash; `.` and `..` rejected. | Low for named profiles; explicit `--user-data-dir` remains operator-controlled. |
| Profile reset | `src/browser-manager.js`, `src/cli.js` | `--reset-profile` and remote `resetProfile` recursively delete selected broker profile path. | Destructive by design; should remain explicit. |
| CDP exposure | `src/server.js`, `src/cli.js` | Broker binds to `127.0.0.1` by default. | Binding to `0.0.0.0` exposes browser control to the network unless protected externally. |
| Lifecycle control endpoints | `src/server.js`, `src/browser-manager.js` | `/_broker/start` and `/_broker/stop` can launch or stop local Chrome. | No app-level auth currently exists; safest when reachable only via localhost/trusted SSH. |
| Instance-scoped CDP URLs | `src/server.js` | Returned `cdpUrl` contains a random `instanceId` and routes to one active instance. | The instance ID is a routing handle, not formal authentication. |
| SSH credentials | `src/cli.js`, `README.md` | Broker spawns native `ssh`; it does not read or store passwords. | SSH prompts and credential caching are delegated to OpenSSH. |
| WebSocket proxy | `src/server.js` | Upgrade traffic is tunneled to Chrome after request header host rewrite. | Any client that reaches broker can control the browser. No app-level auth currently exists. |
