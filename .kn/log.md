# Knowledge Base Log

## 2026-06-17 00:00 UTC - add remote persistent profile clear API

- Trigger: User requested an API that lets remote Playwright clear persistent data.
- Scope: Broker-managed profile clear endpoint, safety checks, tests, README, and KB.
- Raw updated:
  - `.kn/raw/codebase/APIs/http-route-map.md`
  - `.kn/raw/codebase/tests/unit-test-inventory.md`
  - `.kn/raw/codebase/nfr/security-surface.md`
- Tests updated:
  - `test/browser-manager.test.js`
  - `test/server.test.js`
- Notes:
  - `POST /_broker/profiles/clear` clears a named broker profile only when no active instance uses it.

## 2026-06-16 00:30 UTC - implement multi-instance sessions and managed proxy forwards

- Trigger: User requested multi-instance broker sessions, managed proxy port list, `/help`, tests, and `.kn` updates.
- Scope: Multi-instance browser manager, proxy-forward registry, control API updates, broker help text, docs, tests, and KB.
- Raw updated:
  - `.kn/raw/codebase/modules/module-inventory.md`
  - `.kn/raw/codebase/dependencies/import-graph.mmd`
  - `.kn/raw/codebase/APIs/http-route-map.md`
  - `.kn/raw/codebase/tests/unit-test-inventory.md`
  - `.kn/raw/codebase/nfr/security-surface.md`
  - `.kn/raw/codebase/nfr/observability-inventory.md`
- Wiki updated:
  - `.kn/wiki/architecture/system-overview.md`
  - `.kn/wiki/architecture/module-boundaries.md`
  - `.kn/wiki/testing/testing-strategy.md`
  - `.kn/wiki/nfr/security.md`
- FS updated:
  - `.kn/fs/index.md`
  - `.kn/fs/features/managed-proxy-forwards.md`
  - `.kn/fs/features/playwright-backed-video-recording.md`
  - `.kn/fs/features/remote-browser-lifecycle-control.md`
- Tests updated:
  - `test/browser-manager.test.js`
  - `test/proxy-forwards.test.js`
  - `test/server.test.js`
- Notes:
  - Multiple instances may run concurrently only when their resolved profile directories differ.
  - `GET /_broker/help` is now the preferred remote Playwright guide; `/_broker/instructions` remains an alias.
  - Playwright-backed persistent-context video recording is recorded as roadmap, not current scope.

## 2026-06-16 00:00 UTC - document standby browser lifecycle

- Trigger: User requested standby broker lifecycle where remote Playwright can start Chrome with profile and proxy options.
- Scope: Remote browser lifecycle control design, instance-scoped CDP URLs, tests, and implementation.
- Raw updated:
  - `.kn/raw/codebase/modules/module-inventory.md`
  - `.kn/raw/codebase/symbols/symbol-index.jsonl`
  - `.kn/raw/codebase/dependencies/import-graph.mmd`
  - `.kn/raw/codebase/APIs/http-route-map.md`
  - `.kn/raw/codebase/tests/unit-test-inventory.md`
  - `.kn/raw/codebase/nfr/security-surface.md`
  - `.kn/raw/codebase/nfr/observability-inventory.md`
- Wiki updated:
  - `.kn/wiki/architecture/system-overview.md`
  - `.kn/wiki/architecture/module-boundaries.md`
  - `.kn/wiki/testing/testing-strategy.md`
  - `.kn/wiki/nfr/security.md`
- FS updated:
  - `.kn/fs/index.md`
  - `.kn/fs/features/remote-browser-lifecycle-control.md`
- Tests updated:
  - `test/browser-manager.test.js`
  - `test/server.test.js`
  - `test/cli.test.js`
  - `test/chrome.test.js`
- Notes:
  - Initial implementation is single-instance but uses instance-scoped URLs so the contract can generalize to multi-instance later.

## 2026-06-16 00:15 UTC - expose remote agent instructions

- Trigger: User clarified the remote Playwright workspace cannot access this broker repository.
- Scope: Broker-served integration instructions and copyable helper source.
- Raw updated:
  - `.kn/raw/codebase/APIs/http-route-map.md`
  - `.kn/raw/codebase/tests/unit-test-inventory.md`
- Tests updated:
  - `test/server.test.js`
- Notes:
  - Remote agents can read `GET /_broker/instructions` or `GET /_broker/client.js` through the same broker URL they use for CDP.

## 2026-06-15 00:00 UTC - initialize KB after broker implementation

- Trigger: User requested broker implementation and `.kn/` wiki maintenance.
- Scope: Initial Node.js broker implementation, tests, docs, and KB bootstrap.
- Raw updated:
  - `.kn/raw/codebase/modules/module-inventory.md`
  - `.kn/raw/codebase/symbols/symbol-index.jsonl`
  - `.kn/raw/codebase/dependencies/import-graph.mmd`
  - `.kn/raw/codebase/dependencies/package-dependency-report.md`
  - `.kn/raw/codebase/APIs/http-route-map.md`
  - `.kn/raw/codebase/configs/env-config-inventory.md`
  - `.kn/raw/codebase/build-runtime/runtime-inventory.md`
  - `.kn/raw/codebase/tests/unit-test-inventory.md`
  - `.kn/raw/codebase/e2e/e2e-scenario-map.md`
  - `.kn/raw/codebase/nfr/security-surface.md`
  - `.kn/raw/codebase/nfr/observability-inventory.md`
- Wiki updated:
  - `.kn/wiki/index.md`
  - `.kn/wiki/architecture/system-overview.md`
  - `.kn/wiki/architecture/module-boundaries.md`
  - `.kn/wiki/operations/build-and-runtime.md`
  - `.kn/wiki/testing/testing-strategy.md`
  - `.kn/wiki/nfr/nfr-overview.md`
  - `.kn/wiki/nfr/security.md`
  - `.kn/wiki/nfr/reliability.md`
  - `.kn/wiki/nfr/observability.md`
  - `.kn/wiki/decisions/adr-index.md`
- FS updated:
  - `.kn/fs/index.md`
  - `.kn/fs/features/chrome-compatible-cdp-broker.md`
  - `.kn/fs/features/persistent-browser-profiles.md`
  - `.kn/fs/integrations/ssh-reverse-tunnel.md`
- Notes:
  - Repository has no commit yet; raw docs cite working tree paths and `commit: none`.
  - Governing KB prompt copied to `.kn/SKILL.md`.
