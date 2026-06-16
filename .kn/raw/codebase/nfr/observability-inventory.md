---
title: Observability Inventory
type: raw-nfr-observability
generated: 2026-06-16T00:00:00Z
commit: none
command: "manual observability scan"
sources:
  - src/browser-manager.js
  - src/cli.js
  - src/proxy-forwards.js
  - src/server.js
---

# Observability Inventory

Current operator-visible signals:

- Chrome executable path and profile path are printed at launch.
- Broker listen URL is printed after server startup.
- Remote Playwright `connectOverCDP` hint is printed.
- Standby mode prints the broker start endpoint.
- Immediate mode prints both root and instance-scoped Playwright connection hints.
- SSH tunnel target, remote/local mapping, and ControlPersist value are printed.
- Managed proxy-forward creation prints the local-to-remote port mapping unless quiet mode is enabled.
- Unexpected Chrome and SSH exits are logged to stderr.
- HTTP proxy failures return JSON error responses with status-specific codes.

Current gaps:

- No structured logging.
- No request/connection counters.
- No explicit logging for each CDP client connection.
- No readiness endpoint beyond `/healthz`.
