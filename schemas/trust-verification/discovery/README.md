# Trust Verification Discovery Records (Examples)

These discovery records are **optional metadata examples** for CLAS trust-verification agents.

## Purpose

The example records in this folder connect:

- canonical capability names
- request and receipt schemas
- OpenAPI descriptions
- MCP tool schemas
- verifier expectations
- ENS namespace hints
- agent-card style discovery metadata

## Important Notes

- CLAS remains **network-agnostic**; discovery records are not required for CLAS capability execution.
- ENS is optional and can make discovery records easier to resolve in compatible ecosystems.
- ERC-8004 is optional and can assist registry alignment where supported.
- Canonical capability names come from the trust-verification capability catalog at `../capabilities.json`.

## Included Example Records

- `verifyagent.discovery.json`
- `authorizeagent.discovery.json`
- `attestagent.discovery.json`

All records in this directory are marked with `"status": "example"` and are documentation artifacts only. They are not assertions of live ENS or registry publication.
