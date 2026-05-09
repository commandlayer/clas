# CLAS Receipt Format

CLAS receipts are deterministic verification artifacts for action execution.

## Canonicalization

Before hashing or signing, receipt payloads are canonicalized with `json.sorted_keys.v1` so equivalent JSON always produces the same byte representation.

## Hashing

CLAS uses `SHA-256` over canonicalized receipt content. The hash binds all signed fields.

## Signatures

CLAS uses `Ed25519` signatures for compact, modern, deterministic verification.

## Signer identity

Each receipt includes signer identity metadata (for example namespace and key identifier) so verifiers can resolve expected public keys.

## ENS TXT public key resolution

A namespace like `verifyagent.eth` can publish verification key material in ENS TXT records. Verifiers can resolve TXT data and match key identifiers.

## Local verification

Verification can be performed locally and offline when the canonical receipt payload and public key are available.

## Hosted verifiers

Hosted verifier services are optional convenience endpoints. They do not replace independent verification or become the trust root.
