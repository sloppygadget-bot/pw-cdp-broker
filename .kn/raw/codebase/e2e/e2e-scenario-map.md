---
title: E2E Scenario Map
type: raw-e2e-map
generated: 2026-06-15T00:00:00Z
commit: none
command: "manual e2e scan"
sources:
  - README.md
---

# E2E Scenario Map

No automated e2e tests exist yet.

Documented manual scenario:

| Scenario | Preconditions | Steps | Expected Result |
|---|---|---|---|
| Remote Playwright MFA through local Chrome | Local Chrome available; broker running; remote host can reach broker directly or through SSH tunnel. | Start broker with named profile, connect from remote Playwright with `chromium.connectOverCDP('http://127.0.0.1:18080')`, complete MFA in visible local browser. | Remote test continues using local Chrome session and profile-backed auth state. |
