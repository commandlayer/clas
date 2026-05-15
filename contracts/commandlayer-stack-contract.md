# CommandLayer Stack Contract

## 1. Authority and scope

This document is the canonical cross-repository alignment contract for the CommandLayer stack.

**Normative requirements:**
- This contract **MUST** be treated as binding for how participating repositories interpret and enforce receipt lifecycle semantics.
- This contract **MUST NOT** be interpreted as replacing normative CLAS schemas.
- This contract **MUST NOT** be interpreted as replacing governance RFC processes.
- Where schema text and this contract appear to diverge, implementers **MUST** resolve the divergence through governance RFC and schema updates rather than ad hoc implementation behavior.

## 2. Repository responsibility map

The following responsibilities are authoritative:

- **commandlayer/governance**: policy, RFCs, release coordination, compatibility matrix, audits.
- **commandlayer/clas**: normative CLAS schemas, specs, and contract documents.
- **commandlayer/runtime-core**: canonicalization, hashing, signing, verification primitives only.
- **commandlayer/runtime**: execution engine and receipt emission.
- **commandlayer/agent-sdk**: developer wrapper for emitting and submitting receipts.
- **commandlayer/verifyagent**: public verifier implementation, UI, and API.
- **commandlayer/mcp-server**: MCP bridge and transport integration.
- **commandlayer/commandlayer-org**: public website, docs, registry, and demos.

## 3. Receipt object requirements

A receipt is a signed record of an agent action.

**Normative required top-level fields:**
- `receipt_id`
- `signer`
- `verb`
- `ts`
- `input`
- `output`
- `execution`
- `metadata`

**Normative required `metadata.proof` fields:**
- `canonicalization`
- `hash.alg`
- `hash.value`
- `signature.alg`
- `signature.value`
- `signature.kid`

Implementations **MUST** reject receipts missing required fields.

## 4. Canonicalization

Normative canonicalization ID: `json.sorted_keys.v1`.

**Normative requirements:**
- Implementations **MUST** use deterministic JSON canonicalization.
- Implementations **MUST** sort object keys recursively.
- Implementations **MUST** preserve JSON value semantics.
- Implementations **MUST NOT** include the signature value itself in the signed hash payload unless explicitly specified by the schema.

## 5. Hashing

Normative hash algorithm: `SHA-256`.

**Normative requirements:**
- Hash value **MUST** be encoded as lowercase hexadecimal unless a schema version explicitly defines another encoding.
- Verifiers **MUST** recompute the canonical payload hash.
- Verifiers **MUST** fail if the recomputed hash differs from `metadata.proof.hash.value`.

## 6. Signatures

Normative signature algorithm: `Ed25519`.

**Normative requirements:**
- Signature verification **MUST** be real and never mocked.
- Verifiers **MUST** fail closed if the public key cannot be resolved.
- Signature key id **MUST** be represented by `metadata.proof.signature.kid`.
- The `signer` field **MUST** identify the claimed signer namespace or identity.
- ENS TXT records **MAY** be used for public key discovery where supported.
- No implementation **MAY** hardcode production public keys as the only verification path.

## 7. Verifier result shape

Verifiers **MUST** return, at minimum, the following shape for a verified receipt:

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

For invalid receipts, verifiers **MUST** return, at minimum:

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

## 8. Required verification checks

Verifiers **MUST** check all of the following:
- schema validity
- canonicalization ID
- hash algorithm
- recomputed hash match
- signature algorithm
- signature validity
- signer/key consistency
- required fields
- unsupported algorithms

## 9. Standard error codes

Verifiers **MUST** support the following standard error codes:
- `ERR_INVALID_SIGNATURE`
- `ERR_HASH_MISMATCH`
- `ERR_SCHEMA_INVALID`
- `ERR_ENS_KEY_NOT_FOUND`
- `ERR_CANONICALIZATION_MISMATCH`
- `ERR_UNSUPPORTED_ALGORITHM`
- `ERR_MISSING_REQUIRED_FIELD`
- `ERR_SIGNER_MISMATCH`
- `ERR_UNSUPPORTED_RECEIPT_VERSION`
- `ERR_MALFORMED_PROOF`

## 10. Compatibility expectations

### runtime-core
- **MUST NOT** perform network calls.
- **MUST NOT** emit runtime execution receipts.
- **MUST NOT** contain website or demo code.

### runtime
- **MUST NOT** redefine cryptographic semantics.
- **MUST** use `runtime-core` or equivalent compliant primitives.

### agent-sdk
- **MUST NOT** invent alternate receipt shapes.
- **MUST** expose developer APIs aligned to CLAS.

### verifyagent
- **MUST** verify using this same contract.
- **MUST NOT** mark receipts verified if hash or signature checks fail.

### mcp-server
- **MUST** bridge protocol actions without changing receipt semantics.

### commandlayer-org
- **MUST** document only supported behavior.
- **MUST NOT** claim unsupported package status or verification guarantees.

### governance
- **MUST** coordinate changes through RFCs and compatibility updates.

## 11. Rules for changing this contract

**Normative requirements:**
- Material changes **MUST** require governance review.
- Breaking changes **MUST** require an RFC.
- Downstream repositories **MUST** be audited after contract changes.
- Compatibility matrix **MUST** be updated when contract-impacting behavior changes.

## 12. Non-goals

This contract does not define:
- commercial pricing
- hosted API limits
- x402 payment rules
- UI requirements
- chain-specific deployment requirements
- package publication status
