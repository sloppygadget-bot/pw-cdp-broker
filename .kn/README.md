# pw-cdp-broker Knowledge Base

This `.kn/` directory is the repo-local knowledge base for `pw-cdp-broker`.

The governing maintenance prompt is `.kn/SKILL.md`, copied from
`karpathy_codebase_kb_skill.md`.

Use this KB as a source-linked map of the codebase:

- `raw/` contains mechanical facts extracted from source, tests, config, and docs.
- `wiki/` contains durable architecture and operations explanations.
- `fs/` contains scoped feature and integration specifications.
- `log.md` records every KB maintenance operation.

When source changes, refresh impacted raw files first, then update linked wiki
and feature spec pages, and append an entry to `.kn/log.md`.
