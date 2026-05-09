# CLAS: CommandLayer Action Specification

CLAS (CommandLayer Action Specification) is an open, canonical schema repository for interoperable machine actions.

Current version anchor: **CLAS v1.0.0** (`clas@1`).

This repository is intentionally simple:
- It is **not** a runtime.
- It is **not** an SDK.
- It is **not** a marketplace.
- It only defines schemas, examples, manifests, and documentation.

## Quick example

A CLAS action schema defines the action name, namespace, input, output, receipt rules, and verification rules:

```json
{
  "clas": "clas.verify.v1",
  "action": "verify",
  "definition": "confirm claim against evidence",
  "namespace": "verifyagent.eth",
  "family": "trust-verification",
  "version": "1.0.0",
  "status": "live",
  "verification": {
    "emits_receipt": true,
    "receipt_schema": "cl.receipt.v1",
    "verify_with": "verifyagent.eth",
    "signature_algorithm": "Ed25519",
    "hash": "SHA-256",
    "canonicalization": "json.sorted_keys.v1",
    "network_agnostic": true
  }
}
```

A receipt can be verified locally without trusting the server that transported it:

```json
{
  "receipt_schema": "cl.receipt.v1",
  "action": "verify",
  "namespace": "verifyagent.eth",
  "canonicalization": "json.sorted_keys.v1",
  "hash_algorithm": "SHA-256",
  "signature_algorithm": "Ed25519",
  "payload_hash": "<sha256-hex>",
  "signature": "<ed25519-signature>",
  "signer": "runtime.commandlayer.eth"
}
```

## Schemas

Start here:

- [`schemas/trust-verification`](./schemas/trust-verification)
- [`schemas/trust-verification/manifest.v1.json`](./schemas/trust-verification/manifest.v1.json)
- [`schemas/trust-verification/verify/schema.v1.json`](./schemas/trust-verification/verify/schema.v1.json)

## Family status

| Family | Status | Notes |
|---|---:|---|
| trust-verification | defined | First fully defined CLAS family. |
| content-creation | stub | Planned schema family. |
| commerce-payments | stub | Planned schema family. |
| identity-compliance | stub | Planned schema family. |
| logistics-fulfillment | stub | Planned schema family. |
| data-analytics | stub | Planned schema family. |
| workflow-approval | stub | Planned schema family. |
| lifecycle-management | stub | Planned schema family. |
| training-optimization | stub | Planned schema family. |
| communication-outreach | stub | Planned schema family. |

## Trust & Verification verbs

- verify = confirm claim against evidence
- authenticate = confirm identity and source
- attest = signed assertion of truth
- certify = formal confirmation condition met
- notarize = immutable timestamped witness record
- validate = schema and rule conformance check
- witness = observed event record
- approve = authorization to proceed
- sign = cryptographic commitment
- endorse = trust and reputation voucher

## Why CLAS is free and open

Machine action interoperability improves when schemas are public, auditable, and easy to adopt. CLAS is published as open documentation and JSON artifacts so any runtime, API, chain, or agent framework can implement the same action contracts.

## Receipts and verification

Every CLAS family manifest requires receipts and verification. Action schemas define how inputs and outputs map to receipts, and how receipts are verified using canonical JSON, SHA-256 hashes, and Ed25519 signatures.

The receipt is the protocol. Hosted verification APIs and MCP servers are convenience layers, not the trust root.

## MCP compatibility

CLAS works with MCP by giving tools a neutral contract:
- `get_action_schema` can return CLAS schema definitions.
- `verify_receipt` can validate CLAS receipts.
- MCP servers act as bridges for transport and discovery, not as the trust root.

## ENS and ERC-8004

ENS and ERC-8004 are public identity and discovery anchors for namespaces and registry visibility. CLAS does not depend on a single network, and receipt verification can happen anywhere those proofs are carried.

## Network-agnostic by design

CommandLayer actions are network-agnostic. ENS/ERC-8004 can help discover and anchor identity, but CLAS receipts are designed to verify across runtimes, chains, APIs, and agent frameworks.

## Current status

- **Trust & Verification** is the first fully defined family in this repository.
- Other families are present as planned, schema-level stubs with canonical manifests.
