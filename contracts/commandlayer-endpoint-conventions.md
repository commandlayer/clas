# CommandLayer Endpoint Conventions

## 1. Scope

This document defines normative ENS TXT record conventions for discovering CommandLayer endpoints and signer metadata.

Implementations that participate in CommandLayer discovery through ENS **MUST** follow this document for TXT record naming and interpretation.

## 2. Goals

This convention is intended to:

- make ENS names usable as discovery roots
- standardize verifier/runtime/MCP endpoint fields
- avoid hardcoded endpoint assumptions
- allow agents, SDKs, and verifiers to resolve capabilities consistently

## 3. Non-goals

This document does not define:

- pricing
- x402 payment enforcement
- uptime guarantees
- chain-specific deployment rules
- UI design
- package publication status

## 4. Required signer TXT records

The following TXT fields are required for ENS-based signer discovery:

- `cl.sig.kid`
- `cl.sig.pub`
- `cl.sig.canonical`
- `cl.receipt.signer`

Example:

- `cl.sig.kid = vC4WbcNoq2znSCiQ`
- `cl.sig.pub = ed25519:hhyCuPNoMk4JtEvGEV8F6nMZ4uDO1EcyizPufmnJTOY=`
- `cl.sig.canonical = json.sorted_keys.v1`
- `cl.receipt.signer = runtime.commandlayer.eth`

Normative rules:

- `cl.sig.kid` **MUST** match `metadata.proof.signature.kid` when ENS-based verification is used.
- `cl.sig.pub` **MUST** identify the public key used for signature verification.
- `cl.sig.pub` **SHOULD** use `ed25519:<base64-raw-public-key>` for Ed25519 keys.
- `cl.sig.canonical` **MUST** match `metadata.proof.canonicalization`.
- `cl.receipt.signer` **MUST** match the receipt signer identity when ENS-based verification is used.

## 5. Canonical endpoint TXT records

The following TXT fields define canonical endpoint discovery keys:

- `cl.endpoint.runtime`
- `cl.endpoint.verify`
- `cl.endpoint.mcp`
- `cl.endpoint.docs`
- `cl.endpoint.registry`

Meanings:

- `cl.endpoint.runtime`: Base URL for runtime execution APIs.
- `cl.endpoint.verify`: URL for receipt verification API.
- `cl.endpoint.mcp`: URL for MCP bridge endpoint.
- `cl.endpoint.docs`: URL for human-readable docs.
- `cl.endpoint.registry`: URL for machine-readable agent or SDK record.

## 6. Endpoint URL rules

- Endpoint values **MUST** be absolute HTTPS URLs for public production endpoints.
- Local development **MAY** use `http://localhost`.
- Endpoint values **MUST NOT** include private secrets.
- Endpoint values **SHOULD** be stable and version-tolerant.
- APIs **SHOULD** expose explicit versioned routes where appropriate.

## 7. Recommended route conventions

Recommended routes are:

Runtime:

- `POST /execute`
- `POST /receipts`
- `GET /health`

Verifier:

- `POST /verify`
- `GET /health`

MCP:

- `POST /mcp` or an MCP-compatible transport endpoint

Registry:

- `GET` machine-readable JSON record

Docs:

- human-readable HTTPS page

## 8. Existing compatibility note

Older or external ecosystems **MAY** use fields such as `agent-endpoint[mcp]`.

CommandLayer-native discovery **SHOULD** prefer `cl.endpoint.mcp`.

## 9. Example full TXT record set

Example (`runtime.commandlayer.eth`):

- `avatar = https://euc.li/runtime.commandlayer.eth`
- `cl.sig.kid = vC4WbcNoq2znSCiQ`
- `cl.sig.pub = ed25519:hhyCuPNoMk4JtEvGEV8F6nMZ4uDO1EcyizPufmnJTOY=`
- `cl.sig.canonical = json.sorted_keys.v1`
- `cl.receipt.signer = runtime.commandlayer.eth`
- `cl.endpoint.runtime = https://runtime.commandlayer.org`
- `cl.endpoint.verify = https://www.commandlayer.org/api/verify`
- `cl.endpoint.mcp = https://mcp.commandlayer.org/mcp`
- `cl.endpoint.docs = https://www.commandlayer.org/docs`
- `cl.endpoint.registry = https://www.commandlayer.org/sdk-records/runtime.commandlayer.eth.json`
- `agent-context = CommandLayer runtime signer for verifiable machine-action receipts.`

## 10. Consumer behavior

SDKs, verifiers, runtimes, and integrations consuming ENS discovery data **SHOULD**:

- resolve TXT records
- validate signer metadata
- validate endpoint values
- fail closed for signature/key mismatch
- fail clearly for missing optional endpoints
- never treat endpoint discovery as proof of endorsement

## 11. Security considerations

- Endpoint records are discovery hints, not proof by themselves.
- Signature verification remains mandatory.
- Clients **SHOULD** validate HTTPS.
- Clients **SHOULD NOT** send secrets to arbitrary discovered endpoints.
- ENS record compromise can redirect endpoints.
- Verifiers **SHOULD** display resolved identity and key id where helpful.

## 12. Change process

Material changes to this document **MUST** require governance review and compatibility matrix update.
