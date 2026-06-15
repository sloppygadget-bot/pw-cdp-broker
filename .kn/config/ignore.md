# KB Ignore Rules

The KB should ignore generated or external dependency content:

- `.git/`
- `.kn/`
- `node_modules/`
- `coverage/`
- OS metadata such as `.DS_Store`

The KB should include runtime docs and tests because they define user-facing CLI
behavior and the tested contract.
