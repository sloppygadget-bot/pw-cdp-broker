---
title: Environment And Config Inventory
type: raw-config-inventory
generated: 2026-06-15T00:00:00Z
commit: none
command: "manual config scan"
sources:
  - src/cli.js
  - src/chrome.js
  - package.json
---

# Environment And Config Inventory

## Environment Variables

| Variable | Used In | Purpose | Secret |
|---|---|---|---|
| `CHROME_PATH` | `src/cli.js`, `src/chrome.js` | Optional Chrome executable path override. | No |
| `LOCALAPPDATA` | `src/chrome.js` | Windows Chrome path discovery. | No |
| `PROGRAMFILES` | `src/chrome.js` | Windows Chrome path discovery. | No |
| `PROGRAMFILES(X86)` | `src/chrome.js` | Windows Chrome path discovery. | No |

## CLI Configuration Surface

| Option | Purpose |
|---|---|
| `--port` | Broker CDP listen port, default `18080`. |
| `--host` | Broker listen host, default `127.0.0.1`. |
| `--profile` | Named persistent Chrome profile. |
| `--user-data-dir` | Explicit Chrome profile path. |
| `--reset-profile` | Deletes the selected profile before launch. |
| `--chrome-port` | Chrome remote debugging port, default random free port. |
| `--chrome-executable` | Explicit Chrome/Chromium executable. |
| `--chrome-arg` | Repeatable extra Chrome argument. |
| `--headless` | Launches Chrome with `--headless=new`. |
| `--ssh` | Starts OpenSSH reverse tunnel. |
| `--ssh-remote-port` | Remote tunnel port. |
| `--ssh-control-persist` | OpenSSH ControlPersist value, default `24h`. |
