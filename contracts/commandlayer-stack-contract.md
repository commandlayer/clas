# CommandLayer Stack Contract (Canonical Cross-Repository Contract)

## 1. Authority and Scope

This document is the canonical protocol-level contract for the CommandLayer stack.

**Normative authority:** All participating repositories **MUST** align protocol behavior, data shapes, and verification outcomes with this contract.

This contract applies to interoperability between:
- `runtime-core`
- `runtime`
- `agent-sdk`
- `verifyagent`
- `mcp-server`
- `commandlayer-org`
- `governance`

This contract defines protocol requirements only. It does not define implementation internals unless explicitly stated.

## 2. Repository Responsibility Map

The following responsibilities are normative:

- `runtime-core` **MUST** provide canonical protocol primitives for receipt generation and verification input preparation.
- `runtime` **MUST** produce receipts and signature proof objects compliant with this contract.
- `agent-sdk` **MUST** expose APIs that preserve contract-required fields without lossy transformation.
- `verifyagent` **MUST** evaluate receipts and proofs using the required canonicalization, hash, signature, and validation checks defined herein.
- `mcp-server` **MUST** transport and expose receipt and verifier result payloads without altering normative fields.
- `commandlayer-org` **MUST** maintain operational guidance and cross-repo alignment artifacts that reflect this contract.
- `governance` **MUST** control versioned changes to this contract and adjudicate backward-compatibility expectations.

## 3. Receipt Object Requirements

A receipt is the canonical protocol artifact for command execution evidence.

A conforming receipt object:
- **MUST** be valid JSON.
- **MUST** include all required fields defined in Section 4.
- **MUST** be canonicalizable using `json.sorted_keys.v1` (Section 5).
- **MUST** be hashable with SHA-256 (Section 6).
- **MUST** be signable/verifiable with Ed25519 (Section 7).
- **MAY** include additional non-required fields only if they do not alter required-field semantics.

## 4. Required Receipt Fields

A conforming receipt object **MUST** include, at minimum, the following top-level fields:

- `receiptVersion` (string): protocol receipt version identifier.
- `receiptId` (string): globally unique receipt identifier.
- `issuedAt` (string): timestamp in RFC 3339 format.
- `issuer` (object): issuer identity descriptor.
- `subject` (object): subject identity descriptor.
- `payload` (object): command/result payload covered by hashing/signature.
- `canonicalizationId` (string): **MUST** be `json.sorted_keys.v1`.
- `hashAlgorithm` (string): **MUST** be `SHA-256`.
- `payloadHash` (string): digest of the canonicalized payload.
- `signatureProof` (object): proof object meeting Section 8.

Receipts **SHOULD** avoid nullable required fields. If a required field is present, its value **MUST NOT** be semantically empty for protocol validation.

## 5. Canonicalization ID: `json.sorted_keys.v1`

The canonicalization identifier for this contract is fixed:

- `canonicalizationId` **MUST** equal `json.sorted_keys.v1`.

Normative behavior for `json.sorted_keys.v1`:
- JSON object keys **MUST** be serialized in lexicographically sorted order at every object depth.
- Array order **MUST** be preserved as-is.
- No non-deterministic whitespace **MAY** affect the canonicalized byte sequence.
- Canonicalization output **MUST** be deterministic for equivalent semantic input.

## 6. Hash Algorithm: SHA-256

- `hashAlgorithm` **MUST** equal `SHA-256`.
- `payloadHash` **MUST** be computed over the canonicalized payload bytes.
- Hex or base64 encoding form **MUST** be consistent within an implementation and **SHOULD** be documented by that repository’s API surface.

## 7. Signature Algorithm: Ed25519

- Signature generation and verification **MUST** use `Ed25519`.
- Implementations **MUST NOT** silently substitute a different algorithm.
- If a non-supported algorithm is requested or encountered, verifiers **MUST** emit `ERR_UNSUPPORTED_ALGORITHM`.

## 8. Signature Proof Object Requirements

The `signatureProof` object **MUST** contain:

- `algorithm` (string): **MUST** be `Ed25519`.
- `publicKeyId` (string): stable key reference identifier.
- `signature` (string): signature over canonicalized/hash-bound receipt material.
- `signedAt` (string): RFC 3339 timestamp.

The proof object **MAY** include key-discovery metadata (e.g., ENS linkage), but required verification semantics **MUST** remain deterministic from required fields.

## 9. Verifier Result Shape

A verifier result object **MUST** include:

- `ok` (boolean): overall verification outcome.
- `receiptId` (string): identifier of the evaluated receipt.
- `checks` (array): per-check outcomes.
- `errors` (array): zero or more standardized error entries.

Each check entry **SHOULD** include:
- `name` (string)
- `ok` (boolean)
- `code` (string, optional when `ok=true`)
- `message` (string, optional)

Each error entry **MUST** include:
- `code` (string)
- `message` (string)

## 10. Required Verification Checks

Verifiers **MUST** perform, at minimum, the following checks:

1. Receipt structure and required-field presence.
2. Schema validity against applicable receipt schema.
3. Canonicalization ID support and deterministic canonicalization conformance.
4. Hash algorithm support and recomputed hash equality.
5. Signature algorithm support.
6. Signature cryptographic validity.
7. Key resolution/discovery success for declared key identifier.

A failed required check **MUST** set `ok=false` and **MUST** include at least one standardized error code from Section 11.

## 11. Standard Error Codes

Verifiers **MUST** use the following standardized error codes where applicable:

- `ERR_INVALID_SIGNATURE`
- `ERR_HASH_MISMATCH`
- `ERR_SCHEMA_INVALID`
- `ERR_ENS_KEY_NOT_FOUND`
- `ERR_CANONICALIZATION_MISMATCH`
- `ERR_UNSUPPORTED_ALGORITHM`

Error payloads **MAY** include implementation-specific details, but the code values above **MUST** remain exact.

## 12. Compatibility Expectations

- `runtime-core` **MUST** maintain contract-level compatibility for canonicalization, hash, and signature primitives.
- `runtime` **MUST** emit receipts and proofs that pass required checks in conforming verifiers.
- `agent-sdk` **MUST** preserve normative fields and **MUST NOT** mutate canonicalized/signature-covered content implicitly.
- `verifyagent` **MUST** emit verifier result shapes and standardized error codes per this contract.
- `mcp-server` **MUST** relay payloads and results without semantic mutation of normative fields.
- `commandlayer-org` **SHOULD** publish ecosystem guidance mapped to this contract version.
- `governance` **MUST** enforce change control and versioning discipline for normative updates.

## 13. Rules for Changing This Contract

Any change to normative requirements in this document:

- **MUST** be proposed through governance review.
- **MUST** include explicit compatibility impact analysis.
- **MUST** define migration expectations for all repositories listed in Section 2.
- **MUST** increment contract version metadata when such metadata is introduced.
- **SHOULD** preserve backward compatibility when feasible; otherwise, breaking changes **MUST** be clearly labeled.

No repository **MAY** unilaterally redefine normative terms in this contract.

## 14. Non-Goals

This contract does **NOT**:

- Define language-specific APIs or SDK ergonomics.
- Mandate repository-internal file layouts.
- Declare production rollout status for any repository.
- Override existing governance process for release, publication, merge, or deployment policy.
- Introduce schema or export changes by itself.
