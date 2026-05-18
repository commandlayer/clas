# CLAS Trust Verification v1

## 1. Overview

Trust Verification v1 defines a standards-oriented, machine-readable schema family for trust-related machine actions and decisions. It provides canonical verbs and structured receipts for verification, identity confirmation, permissioning, attestations, approvals, rejections, signatures, and endorsements.

The intent is protocol interoperability: consistent request/receipt structures that can be validated, exchanged, and independently verified across systems.

## 2. Canonical verbs

Trust Verification v1 defines these canonical verbs:

- `verify`
- `authenticate`
- `authorize`
- `attest`
- `sign`
- `permit`
- `grant`
- `approve`
- `reject`
- `endorse`

## 3. Verb definitions

- **verify**: checks whether a subject, proof, receipt, signature, artifact, claim, or workflow result is valid.
- **authenticate**: confirms the identity of an actor, signer, agent, service, key, user, or caller.
- **authorize**: determines whether an actor is allowed to perform an action under a policy or scope.
- **attest**: creates a signed claim about a subject.
- **sign**: applies cryptographic authorship, approval, or intent to a payload.
- **permit**: represents a portable permission artifact.
- **grant**: issues access, authority, rights, or permission to an actor.
- **approve**: records a positive decision on a proposal, transaction, request, deployment, or workflow step.
- **reject**: records a negative decision on a proposal, transaction, request, deployment, or workflow step.
- **endorse**: adds reputation, support, or trust weight to an actor, signer, claim, schema, service, or capability.

## 4. Semantic boundaries

- **verify vs attest**
  - `verify` evaluates existing evidence and returns a validity outcome.
  - `attest` produces new signed evidence (a claim) about a subject.

- **authenticate vs authorize**
  - `authenticate` answers "who is this actor?"
  - `authorize` answers "what is this actor allowed to do?"

- **authorize vs approve**
  - `authorize` is policy/scope enforcement for allowed actions.
  - `approve` is a decision event on a specific request, transaction, or workflow step.

- **grant vs permit**
  - `grant` is the issuance action that assigns rights.
  - `permit` is the transferable/portable artifact expressing those rights.

- **approve vs reject**
  - `approve` records a positive decision.
  - `reject` records a negative decision.

- **sign vs attest**
  - `sign` binds cryptographic intent/authorship to payload bytes.
  - `attest` expresses a semantic claim about a subject and is typically signed.

- **endorse vs certify**
  - `endorse` adds support or trust weight without claiming formal institutional certification.
  - `certify` is intentionally excluded from v1 because it overlaps with `verify` and `attest` and may imply regulatory or institutional certification semantics.

## 5. Shared proof model

Every receipt references the shared proof schema:

- `../_shared/proof.schema.json`

Shared proof fields (as defined in `_shared/proof.schema.json`):

- `metadata.proof.canonicalization` — canonicalization identifier (const: `json.sorted_keys.v1`)
- `metadata.proof.hash.alg` — hash algorithm (const: `SHA-256`)
- `metadata.proof.hash.value` — lowercase SHA-256 hex digest (`64` hex chars)
- `metadata.proof.signature.alg` — signature algorithm (const: `Ed25519`)
- `metadata.proof.signature.value` — signature value
- `metadata.proof.signature.kid` — key identifier

These fields provide a common cryptographic envelope model across all verb receipts.

## 6. Schema-valid vs cryptographically valid

A receipt can be valid JSON and pass schema validation while still failing cryptographic verification.

Tampered receipts are expected to remain schema-valid but fail signature/hash verification.

Schema conformance and cryptographic integrity are separate checks and must both be evaluated.

## 7. Examples

Each verb's `examples/` folder includes:

- `valid.request.json`: a schema-valid request example for the verb.
- `valid.receipt.json`: a schema-valid receipt example with intact proof fields.
- `tampered.receipt.json`: a schema-valid receipt whose payload/proof relationship has been altered and should fail cryptographic verification.
- `invalid.receipt.json`: a receipt that fails schema validation.

## 8. File convention

Each verb folder contains:

- `<verb>.request.schema.json`
- `<verb>.receipt.schema.json`
- `examples/`
