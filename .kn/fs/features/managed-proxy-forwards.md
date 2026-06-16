---
title: Managed Proxy Forwards
type: feature-spec
status: active
updated: 2026-06-16
feature_owner: unknown
confidence: high
---

# Feature Spec: Managed Proxy Forwards

## Summary

The broker can maintain a global list of SSH-backed proxy forwards that remote
Playwright clients can create, list, delete, and reference from browser start
requests. This lets multiple broker-controlled Chrome instances share a stable
local proxy URL while the actual proxy runs on the remote SSH host.

## Behavior

- `POST /_broker/proxy-forwards` creates an SSH `-L` forward using the broker's
  configured `--ssh` target.
- `GET /_broker/proxy-forwards` lists forwards and the browser instances using
  each forward.
- `DELETE /_broker/proxy-forwards/<id>` removes a forward only when no running
  instance references it.
- `POST /_broker/start` accepts `proxyForwardId`; the broker resolves it to the
  forward's `proxyServer`.
- `proxyServer` and `proxyForwardId` are mutually exclusive in a start request.

## Sources

- Code: `../../../src/proxy-forwards.js`
- Code: `../../../src/server.js`
- Tests: `../../../test/proxy-forwards.test.js`
- Tests: `../../../test/server.test.js`
