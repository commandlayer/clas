# CommandLayer Stack Contract

Status: Normative alignment contract
Scope: CommandLayer protocol stack

This document defines the canonical cross-repository contract for the CommandLayer stack. It defines how repositories interpret the CommandLayer action receipt lifecycle and where responsibilities belong across the stack.

This contract does not replace CLAS schemas, governance RFCs, or release policy. CLAS schemas remain the normative machine-readable artifacts. Governance RFCs remain the process for material protocol changes. This document binds implementation expectations across repositories so that receipt semantics, verification behavior, and public documentation do not drift.

## 1. Authority and scope

This file is the canonical alignment contract for the CommandLayer stack.

Implementations that claim compatibility with the CommandLayer stack MUST align with this contract unless a later accepted governance RFC explicitly supersedes it.

This contract applies to:

- receipt construction
- receipt proof structure
- canonicalization
- hashing
- signature verification
- verifier result semantics
- repository responsibility boundaries
- cross-repository compatibility expectations

This contract does not define commercial packaging, hosted service pricing, product tiers, or package publication status.

## 2. Repository responsibility map

The following responsibility boundaries are normative.

| Repository | Responsibility |
| --- | --- |
| `commandlayer/governance` | Policy, RFCs, release coordination, compatibility matrix, audits, and security coordination. |
| `commandlayer/clas` | Normative CLAS schemas, specifications, and contract documents. |
| `commandlayer/runtime-core` | Canonicalization, hashing, signing, and verification primitives only. |
| `commandlayer/runtime` | Execution engine and receipt emission. |
| `commandlayer/agent-sdk` | Developer wrapper for emitting, submitting, and verifying CommandLayer receipts. |
| `commandlayer/verifyagent` | Public verifier implementation, UI, and API. |
| `commandlayer/mcp-server` | MCP bridge and transport integration. |
| `commandlayer/commandlayer-org` | Public website, documentation, registry, and demos. |

No repository MAY redefine receipt semantics in a way that conflicts with this contract.

## 3. Receipt object requirements

A CommandLayer receipt is a signed record of an agent action.

A compliant receipt MUST include the following top-level fields:

- `receipt_id`
- `signer`
- `verb`
- `ts`
- `input`
- `output`
- `execution`
- `metadata`

A compliant receipt MUST include a proof object at `metadata.proof`.

The `metadata.proof` object MUST include:

- `canonicalization`
- `hash.alg`
- `hash.value`
- `signature.alg`
- `signature.value`
- `signature.kid`

The `signer` field MUST identify the claimed signer namespace or identity.

The `verb` field MUST identify the action type or command family represented by the receipt.

The `ts` field MUST identify the receipt timestamp in a schema-valid format.

The `input`, `output`, and `execution` fields MUST preserve the action context required by the applicable CLAS schema.

## 4. Canonicalization

The normative canonicalization identifier is:

```text
json.sorted_keys.v1
```

Implementations MUST use deterministic JSON canonicalization.

Implementations MUST sort object keys recursively.

Implementations MUST preserve JSON value semantics.

Implementations MUST NOT include `metadata.proof.signature.value` itself in the signed hash payload unless an applicable schema version explicitly defines otherwise.

Verifiers MUST reject receipts that specify an unsupported canonicalization identifier.

## 5. Hashing

The normative hash algorithm is:

```text
SHA-256
```

The hash algorithm value in the receipt MUST identify SHA-256.

Hash values MUST be encoded as lowercase hexadecimal unless a schema version explicitly defines another encoding.

Verifiers MUST recompute the canonical payload hash.

Verifiers MUST fail verification if the recomputed hash differs from `metadata.proof.hash.value`.

## 6. Signatures

The normative signature algorithm is:

```text
Ed25519
```

Signature verification MUST be real and MUST NOT be mocked, skipped, simulated, or replaced with placeholder logic.

Verifiers MUST fail closed if the public key cannot be resolved.

The signature key id MUST be represented by `metadata.proof.signature.kid`.

The `signer` field MUST identify the claimed signer namespace or identity.

ENS TXT records MAY be used for public key discovery where supported.

No implementation MAY hardcode production public keys as the only verification path.

Verifiers MUST reject receipts that specify an unsupported signature algorithm.

## 7. Verifier result shape

A verifier response MUST expose enough information for callers to determine whether the receipt verified and which checks passed or failed.

A verified receipt SHOULD use the following minimum shape:

```json
{
  "ok": true,
  "status": "VERIFIED",
  "checks": {
    "schema": true,
    "canonical_hash": true,
    "signature": true,
    "signer": true
  },
  "errors": []
}
```

An invalid receipt SHOULD use the following minimum shape:

```json
{
  "ok": false,
  "status": "INVALID",
  "checks": {
    "schema": false,
    "canonical_hash": false,
    "signature": false,
    "signer": false
  },
  "errors": []
}
```

Implementations MAY include additional fields, but MUST NOT reverse the meaning of `ok`, `status`, `checks`, or `errors`.

`status` MUST NOT be `VERIFIED` unless all required verification checks pass.

## 8. Required verification checks

A compliant verifier MUST check:

- schema validity
- required fields
- canonicalization identifier
- hash algorithm
- recomputed hash match
- signature algorithm
- signature validity
- signer/key consistency
- unsupported algorithms
- malformed proof structure
- unsupported receipt version where versioning is present

A verifier MUST fail closed when it cannot establish required proof validity.

## 9. Standard error codes

Implementations SHOULD use the following error codes when reporting verification failures:

| Error code | Meaning |
| --- | --- |
| `ERR_INVALID_SIGNATURE` | Signature verification failed. |
| `ERR_HASH_MISMATCH` | Recomputed hash did not match receipt hash. |
| `ERR_SCHEMA_INVALID` | Receipt failed schema validation. |
| `ERR_ENS_KEY_NOT_FOUND` | ENS-backed public key discovery failed. |
| `ERR_CANONICALIZATION_MISMATCH` | Unsupported or mismatched canonicalization identifier. |
| `ERR_UNSUPPORTED_ALGORITHM` | Unsupported hash or signature algorithm. |
| `ERR_MISSING_REQUIRED_FIELD` | Required field is absent. |
| `ERR_SIGNER_MISMATCH` | Signer identity does not match resolved key material or expected signer. |
| `ERR_UNSUPPORTED_RECEIPT_VERSION` | Receipt version is unsupported. |
| `ERR_MALFORMED_PROOF` | Proof object is missing, malformed, or internally inconsistent. |

Repositories MAY add narrower error codes, but SHOULD preserve these codes for cross-repository compatibility.

## 10. Compatibility expectations

### `commandlayer/runtime-core`

`runtime-core` MUST NOT perform network calls.

`runtime-core` MUST NOT emit runtime execution receipts.

`runtime-core` MUST NOT contain website or demo UI code.

`runtime-core` MUST provide compliant canonicalization, hashing, signing, and verification primitives.

### `commandlayer/runtime`

`runtime` MUST NOT redefine cryptographic semantics.

`runtime` MUST use `runtime-core` or equivalent compliant primitives.

`runtime` MUST emit receipts aligned with CLAS schemas and this contract.

### `commandlayer/agent-sdk`

`agent-sdk` MUST NOT invent alternate receipt shapes.

`agent-sdk` MUST expose developer APIs aligned to CLAS.

`agent-sdk` MUST NOT claim verification success unless verifier results satisfy this contract.

### `commandlayer/verifyagent`

`verifyagent` MUST verify using this contract.

`verifyagent` MUST NOT mark receipts as verified if hash or signature checks fail.

`verifyagent` MUST expose failure information without weakening cryptographic guarantees.

### `commandlayer/mcp-server`

`mcp-server` MUST bridge protocol actions without changing receipt semantics.

`mcp-server` MUST NOT mutate receipt proof fields in a way that invalidates canonical verification.

### `commandlayer/commandlayer-org`

`commandlayer-org` MUST document only supported behavior.

`commandlayer-org` MUST NOT claim unsupported package publication status or verification guarantees.

`commandlayer-org` demos MUST make clear when data is sample, demo, or live verification output.

### `commandlayer/governance`

`governance` MUST coordinate material changes through RFCs and compatibility updates.

`governance` MUST maintain release sequencing and compatibility records for contract-impacting changes.

## 11. Rules for changing this contract

Material changes to this contract require governance review.

Breaking changes require an accepted RFC.

Downstream repositories MUST be audited after contract-impacting changes.

The compatibility matrix MUST be updated when contract-impacting behavior changes.

Changes that alter receipt shape, canonicalization, hashing, signing, verifier status semantics, or repository boundaries MUST be treated as material.

## 12. Non-goals

This file does not define:

- commercial pricing
- hosted API limits
- x402 payment rules
- UI requirements
- chain-specific deployment requirements
- package publication status
- business development strategy
- customer onboarding flows

Those concerns MAY be documented in other repositories, but they MUST NOT conflict with this contract when they describe CommandLayer receipt behavior.
