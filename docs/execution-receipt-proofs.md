# CLAS Execution Receipt Proof Scopes

Private settlement, public accountability.

`clas.execution.receipt.v1` separates execution proof from settlement proof. A single receipt can contain multiple attestations in `proofs[]`, but each proof must declare exactly which top-level receipt fields it covers.

This is a schema and example-level model only. It does not add runtime verification, x402 integration code, payment-rail calls, or live settlement verification.

## Why proof scopes are explicit

An agent signs what it witnessed: execution. The execution proof covers the receipt identity, the verb, the agent identity, and the action timing/content hashes. It does not cover settlement.

A rail or payer signs what it witnessed: settlement. The settlement proof covers the same `receipt_id` and the settlement envelope. It does not cover the action payload or agent identity.

Both proofs bind to the same `receipt_id`, allowing a verifier to correlate execution and settlement attestations without implying that either signer witnessed the other's domain.

## Required proof coverage

Execution proof coverage is exact:

```json
["receipt_id", "verb", "agent", "action"]
```

Settlement proof coverage is exact:

```json
["receipt_id", "settlement"]
```

Any execution proof that also covers `settlement` is malformed because it would make the agent signature appear to attest payment settlement.

## Public receipts and private settlement

Public settlement receipts commit to private settlement data without exposing a payee address or a raw public transaction hash:

- `settlement.payment_ref` is an opaque reference, not a raw `0x...` transaction hash.
- `settlement.payee_commitment` is a `sha256:...` commitment to private payee data.
- `settlement.verification.mode` is `selective_disclosure` and `viewer_required` is `true`.
- The public receipt records the privacy method and commitment, while any viewer-specific details remain outside the public receipt.

## Files

- Schema: `schemas/execution/execution.receipt.schema.json`
- Execution-only example: `examples/execution/approve.execution.receipt.json`
- Execution plus private settlement example: `examples/execution/approve.execution-private-settlement.receipt.json`
- Invalid agent-covers-settlement example: `examples/execution/approve.execution-private-settlement.invalid-agent-covers-settlement.json`

## Next implementation work

This PR intentionally stops at schemas, examples, docs, and validation tests. Follow-up PRs should add runtime-core proof-scope canonicalization and verification, runtime receipt emission, agent-sdk helpers, and commandlayer-org documentation once the schema model is accepted.
