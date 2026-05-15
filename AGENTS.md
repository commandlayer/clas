# CommandLayer Repository Instructions

This repository is part of the CommandLayer protocol stack.

## Repo role

`commandlayer/clas` is the normative schema and specification repository for CommandLayer Action Schemas.

This repository owns:

- CLAS schema definitions
- CLAS specification documents
- protocol contract documents
- schema validation fixtures
- schema compatibility notes

This repository does not own runtime execution, SDK wrapping behavior, public verifier UI, hosted API behavior, commercial packaging, or website marketing copy.

## Hard rules

- Do not guess.
- Do not publish packages.
- Do not merge pull requests.
- Do not change public schemas without documenting compatibility impact.
- Do not introduce placeholders, TODOs, mocked verification, skipped tests, or hardcoded secrets.
- Do not invent implementation status.
- Do not make cross-repo architecture decisions inside this repo without referencing governance.
- Do not weaken receipt proof requirements.
- Do not change receipt semantics without referencing `contracts/commandlayer-stack-contract.md`.

## Before editing

1. Inspect `README.md`, `package.json`, schema directories, examples, tests, and contract files where present.
2. Identify whether the change is schema, spec, contract, validation, fixture, or documentation work.
3. Compare the change against `contracts/commandlayer-stack-contract.md`.
4. Make the smallest safe change.
5. Run build, test, typecheck, and lint commands if available.
6. Report changed files, commands run, results, and remaining risks.

## Schema rules

- Schema changes MUST preserve explicit versioning semantics.
- Breaking schema changes MUST be called out in the PR summary.
- Required fields MUST match the canonical stack contract unless an accepted governance RFC says otherwise.
- Examples MUST validate against their referenced schemas.
- Tampered examples MAY be schema-valid while cryptographically invalid, but that distinction MUST be documented.
- Absolute `$ref` values SHOULD be avoided unless they are intentionally public and tested offline.

## Review focus

When reviewing changes, focus on:

- schema drift
- contract drift
- README claims not backed by schema files
- examples that do not validate
- stale checksums or manifests
- inconsistent terminology
- unsupported implementation claims
- missing compatibility notes
- proof field mismatches

## Output format

For every task, report:

1. Summary
2. Files changed
3. Checks run
4. Results
5. Risks remaining
6. Follow-up recommendations
