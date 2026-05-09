# CLAS: CommandLayer Action Specification

CLAS (CommandLayer Action Specification) is an open, canonical schema repository for interoperable machine actions.

This repository is intentionally simple:
- It is **not** a runtime.
- It is **not** an SDK.
- It is **not** a marketplace.
- It only defines schemas, examples, manifests, and documentation.

## Why CLAS is free and open

Machine action interoperability improves when schemas are public, auditable, and easy to adopt. CLAS is published as open documentation and JSON artifacts so any runtime, API, chain, or agent framework can implement the same action contracts.

## Receipts and verification

Every CLAS family manifest requires receipts and verification. Action schemas define how inputs and outputs map to receipts, and how receipts are verified using canonical JSON, SHA-256 hashes, and Ed25519 signatures.

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
