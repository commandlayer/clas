# ENS Discovery Alignment for CLAS Trust Verification

## Status and Scope

This document defines a standards-oriented alignment between CLAS trust verification and ENS-based discovery metadata.

- **CLAS remains network-agnostic** and does not depend on any single naming or registry system.
- **ENS is optional infrastructure** for discovery and identity hints.
- **No schema changes are introduced** by this document.

The guidance below is designed for implementers that want interoperability between CLAS verification workflows and ENS-discoverable agent metadata.

## Architectural Positioning

### CLAS Network-Agnostic Model

CLAS trust receipts, signatures, and verifier behavior are defined independently of ENS.

A conformant CLAS verifier:

1. MUST validate receipts using CLAS-defined schemas and verification rules.
2. MUST NOT require an ENS name to validate a receipt.
3. MUST preserve identical validity outcomes whether or not ENS data is present.

### ENS as Optional Discovery and Identity Layer

ENS can improve operator and integrator ergonomics by providing a discoverable metadata layer for:

- routing hints,
- signer discovery,
- capability discovery,
- and agent metadata discovery.

ENS metadata should be treated as advisory discovery input, while cryptographic verification remains grounded in CLAS artifacts and explicit trust policy.

## Discovery Functions Supported by ENS Records

### 1. Routing

ENS records can provide canonical endpoints or pointers that help clients route verification requests to the right service surface (for example, a verifier endpoint or API descriptor).

### 2. Signer Discovery

ENS records can publish expected signer references that help wallets, verifiers, and policy engines pre-resolve signer context before receipt submission.

### 3. Capability Discovery

ENS records can expose machine-readable declarations for supported verbs, proof mechanisms, and family/version information.

### 4. Agent Metadata Discovery

ENS records can aggregate metadata pointers (schemas, OpenAPI, MCP tool descriptors, and identity bindings) into a consistent lookup surface.

## Identity Binding: ENSIP-25

When implementations need identity continuity between a human-readable ENS name and a registered on-chain agent identity, **ENSIP-25 can be used as a binding mechanism**.

In CLAS-aligned deployments, this binding is advisory for discovery and policy context. Receipt validation remains bound to CLAS verification requirements and cryptographic material, not to ENS resolution success.

## Agent Metadata Profiles: ENSIP-26-Style Records

Implementations may use **ENSIP-26-style agent records** to expose CLAS-aligned machine-readable metadata, including:

- CLAS schemas,
- OpenAPI specifications,
- MCP tool descriptions,
- verifier endpoints,
- and capability metadata.

These records are intended to reduce integration friction while preserving CLAS portability across networks and naming systems.

## Suggested ENS Text Record Keys

The following text record keys are suggested for CLAS-aligned discovery profiles:

- `cl.schema`
- `cl.openapi`
- `cl.mcp`
- `cl.receipt.schema`
- `cl.verifier`
- `cl.capability`
- `cl.version`
- `cl.family`
- `cl.verb`
- `cl.proof`
- `cl.signer`
- `agent-registration[<registry>][<agentId>]`

### Key Semantics (Non-Normative)

- `cl.schema`: URI for primary CLAS schema set relevant to the agent.
- `cl.openapi`: URI for HTTP API interface used by clients/integrators.
- `cl.mcp`: URI for MCP server or MCP capability descriptor.
- `cl.receipt.schema`: URI for receipt schema expected by verifier services.
- `cl.verifier`: Verifier endpoint URI.
- `cl.capability`: Capability declaration(s), potentially repeated or encoded as structured payload.
- `cl.version`: CLAS profile or implementation version string.
- `cl.family`: Family identifier for receipt/capability grouping.
- `cl.verb`: Supported operation verb(s).
- `cl.proof`: Supported proof primitive(s) or proof profile(s).
- `cl.signer`: Expected signer identifier(s) or signer key reference(s).
- `agent-registration[<registry>][<agentId>]`: Binding reference from ENS name to an on-chain agent registration tuple.

## Example ENS Text Records

The examples below are illustrative and non-normative.

### `verifyagent.eth`

```txt
cl.schema=https://example.org/clas/schemas/verify/v1
cl.openapi=https://api.verifyagent.eth/openapi.json
cl.mcp=https://mcp.verifyagent.eth/server.json
cl.receipt.schema=https://example.org/clas/schemas/receipt/v1
cl.verifier=https://verify.verifyagent.eth/receipts/verify
cl.capability=verify.receipt
cl.version=1.0
cl.family=trust-verification
cl.verb=verify
cl.proof=ecdsa-secp256k1+jws
cl.signer=did:pkh:eip155:1:0x1111111111111111111111111111111111111111
agent-registration[eip155:1:0xRegistry][agent-001]=eip155:1/agent-001
```

### `authorizeagent.eth`

```txt
cl.schema=https://example.org/clas/schemas/authorize/v1
cl.openapi=https://api.authorizeagent.eth/openapi.json
cl.mcp=https://mcp.authorizeagent.eth/server.json
cl.receipt.schema=https://example.org/clas/schemas/receipt/v1
cl.verifier=https://verify.authorizeagent.eth/receipts/verify
cl.capability=authorize.action
cl.version=1.0
cl.family=trust-verification
cl.verb=authorize
cl.proof=ecdsa-secp256k1+jws
cl.signer=did:pkh:eip155:1:0x2222222222222222222222222222222222222222
agent-registration[eip155:1:0xRegistry][agent-002]=eip155:1/agent-002
```

### `attestagent.eth`

```txt
cl.schema=https://example.org/clas/schemas/attest/v1
cl.openapi=https://api.attestagent.eth/openapi.json
cl.mcp=https://mcp.attestagent.eth/server.json
cl.receipt.schema=https://example.org/clas/schemas/receipt/v1
cl.verifier=https://verify.attestagent.eth/receipts/verify
cl.capability=attest.claim
cl.version=1.0
cl.family=trust-verification
cl.verb=attest
cl.proof=ecdsa-secp256k1+jws
cl.signer=did:pkh:eip155:1:0x3333333333333333333333333333333333333333
agent-registration[eip155:1:0xRegistry][agent-003]=eip155:1/agent-003
```

## Verification Behavior Requirements

To preserve CLAS portability and correctness:

1. Verifiers MUST treat ENS resolution failure as a discovery failure, not an automatic receipt invalidation event.
2. Verifiers MUST validate receipt structure and signatures against CLAS rules even when ENS metadata is available.
3. Implementations MAY use ENS-derived metadata as policy input, but SHOULD separate policy failure from cryptographic invalidity in error reporting.

## Security and Interoperability Notes

- ENS records should be considered mutable metadata and evaluated within explicit trust policy.
- Implementations should define cache TTL and re-resolution strategy for ENS lookups.
- Implementations should avoid implicit privilege escalation based solely on ENS-hosted hints.
- Cross-checking ENS-discovered signer hints against receipt signer material improves operator safety.

## Conformance Summary

This alignment preserves the core property that **CLAS receipts remain valid without ENS** while allowing ENS to improve discovery ergonomics for compatible implementations.
