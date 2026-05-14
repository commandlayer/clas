# CLAS Schema Rules

## Schema file convention

Each CLAS action verb uses two schema files:

- `<verb>.request.schema.json` — defines the shape of a valid request payload
- `<verb>.receipt.schema.json` — defines the shape of a valid receipt payload

These live in the verb's folder under the family directory, for example:

```
schemas/trust-verification/verify/verify.request.schema.json
schemas/trust-verification/verify/verify.receipt.schema.json
```

## Small and strict

Schemas should stay small, explicit, and strict so they are easy to implement across heterogeneous systems.

## No giant enterprise schemas (yet)

CLAS v1 prioritizes portability and clarity over large, monolithic enterprise payload designs.

## Versioning rules

- Use semantic versions in `version` (for example `1.0.0`).
- Introduce a new schema file when making breaking structural changes.
- Keep existing schema versions immutable once published.

## Schema-valid vs cryptographically valid

A receipt can pass schema validation while still failing cryptographic verification. Schema conformance and cryptographic integrity are **separate and independent checks**. Both must be evaluated by a conformant verifier. The `tampered.receipt.json` example files in each verb's `examples/` directory illustrate this: they are intentionally schema-valid but contain tampered payload fields that would fail Ed25519 signature verification.

## Hash binding requirement

All CLAS receipts MUST include a `proof.hash` field containing a `sha256:` prefixed hex digest of the canonicalized receipt payload. This field is required in the proof schema and enforced at validation time. A receipt that omits `proof.hash` is schema-invalid.
