# CLAS Schema Rules

## Required schema shape

Every CLAS action schema must define:
- `action`
- `input`
- `output`
- `receipt`
- `verification`

## Small and strict

Schemas should stay small, explicit, and strict so they are easy to implement across heterogeneous systems.

## No giant enterprise schemas (yet)

CLAS v1 prioritizes portability and clarity over large, monolithic enterprise payload designs.

## Versioning rules

- Use semantic versions in `version` (for example `1.0.0`).
- Introduce a new schema file/version when making breaking structural changes.
- Keep existing versions immutable once published.
