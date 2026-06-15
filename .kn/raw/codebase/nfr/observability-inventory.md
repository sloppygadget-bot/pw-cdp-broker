---
title: Observability Inventory
type: raw-nfr-observability
generated: 2026-06-15T00:00:00Z
commit: none
command: "manual observability scan"
sources:
  - src/cli.js
  - src/server.js
---

# Observability Inventory

Current operator-visible signals:

- Chrome executable path and profile path are printed at launch.
- Broker listen URL is printed after server startup.
- Remote Playwright `connectOverCDP` hint is printed.
- SSH tunnel target, remote/local mapping, and ControlPersist value are printed.
- Unexpected Chrome and SSH exits are logged to stderr.
- HTTP proxy failures return `502` with the error message.

Current gaps:

- No structured logging.
- No request/connection counters.
- No explicit logging for each CDP client connection.
- No readiness endpoint beyond `/healthz`.
