# pw-cdp-broker

`pw-cdp-broker` launches a local visible Chrome/Chromium instance with a
persistent profile and exposes a Chrome-compatible DevTools Protocol endpoint.
Remote Playwright code can connect to that endpoint while you complete MFA in
the local browser window.

## Quick Start

Start the broker locally:

```bash
npm start -- --profile work-okta
```

Or run the CLI directly:

```bash
node bin/pw-cdp-broker.js --profile work-okta
```

From the remote code-server host, point Playwright at the broker endpoint:

```ts
const browser = await chromium.connectOverCDP('http://127.0.0.1:18080');
const context = browser.contexts()[0];
const page = context.pages()[0] ?? await context.newPage();
```

## SSH Reverse Tunnel

If the remote host cannot reach your laptop directly, create a reverse tunnel
from the local machine:

```bash
ssh -R 18080:localhost:18080 user@code-server
```

The broker can manage that tunnel and reuse OpenSSH authentication for 24 hours:

```bash
node bin/pw-cdp-broker.js --profile work-okta --ssh user@code-server
```

That starts:

```bash
ssh -o ControlMaster=auto \
  -o ControlPersist=24h \
  -o ControlPath="$HOME/.pw-cdp-broker/ssh/%C" \
  -N \
  -R 18080:localhost:18080 \
  user@code-server
```

The broker does not ask for, store, or cache SSH passwords. Any password,
passphrase, MFA, or host-key prompt comes from OpenSSH.

## Persistent Profiles

The default profile path is:

```text
~/.pw-cdp-broker/profiles/default
```

Named profiles map to:

```text
~/.pw-cdp-broker/profiles/<name>
```

Use separate profiles for separate applications or accounts:

```bash
node bin/pw-cdp-broker.js --profile work-okta
node bin/pw-cdp-broker.js --profile customer-a
```

Reset a profile:

```bash
node bin/pw-cdp-broker.js --profile work-okta --reset-profile
```

## CDP Compatibility

The broker exposes Chrome-compatible discovery endpoints:

```text
GET /json/version
GET /json
GET /json/list
WS  /devtools/browser/<id>
WS  /devtools/page/<id>
```

It proxies those requests to the local Chrome remote debugging port and rewrites
`webSocketDebuggerUrl` values so Playwright connects back through the broker.

## CLI Options

```text
--port <port>                 Broker CDP port. Default: 18080
--host <host>                 Broker listen host. Default: 127.0.0.1
--profile <name>              Named broker profile. Default: default
--user-data-dir <path>        Explicit Chrome profile path; exclusive with --profile
--reset-profile               Delete the selected profile before launch
--chrome-port <port>          Chrome remote debugging port. Default: random free port
--chrome-executable <path>    Chrome/Chromium executable path
--chrome-arg <arg>            Extra Chrome arg; repeatable
--headless                    Launch Chrome headless
--ssh <user@host>             Start an SSH reverse tunnel to a code-server host
--ssh-remote-port <port>      Remote tunnel port. Default: same as --port
--ssh-control-persist <time>  OpenSSH ControlPersist value. Default: 24h
```
