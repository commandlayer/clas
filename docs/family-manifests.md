# CLAS Family Manifests

Each schema family has a `manifest.json` at its root that acts as the canonical index for that family.

## Standard manifest format

Most families use the following format:

```json
{
  "family": "<family-name>",
  "version": "1.0.0",
  "description": "...",
  "actions": ["<verb1>", "<verb2>", "..."],
  "status": "planned",
  "receipt_required": true,
  "verification_required": true,
  "canonicalization": "json.sorted_keys.v1",
  "hash": "SHA-256",
  "signature_algorithm": "Ed25519"
}
```

### Fields

- `family` — unique family identifier
- `version` — manifest version
- `description` — short description of the family
- `actions` — list of canonical action verbs in this family
- `status` — `draft-v1`, `planned`, or `stable`
- `receipt_required` — whether actions must emit receipts
- `verification_required` — whether receipts must be independently verifiable
- `canonicalization` — canonicalization method for hashing
- `hash` — hash algorithm
- `signature_algorithm` — signature algorithm

## trust-verification manifest format

The `trust-verification` family uses an extended format. Instead of a flat `actions` list, it defines a `verbs` array with per-verb schema paths and optional OpenAPI and MCP tool descriptor paths:

```json
{
  "family": "trust-verification",
  "version": "1.0.0",
  "status": "draft-v1",
  "shared_proof_schema": "_shared/proof.schema.json",
  "verbs": [
    {
      "verb": "verify",
      "request_schema": "verify/verify.request.schema.json",
      "receipt_schema": "verify/verify.receipt.schema.json",
      "examples_path": "verify/examples",
      "openapi_path": "verify/verify.openapi.yaml",
      "mcp_tool_schema_path": "verify/verify.mcp.tool.schema.json"
    }
  ]
}
```

The `shared_proof_schema` field points to a shared cryptographic proof envelope used by all verb receipts in this family.

## How to use

- Use manifests to discover actions in a family.
- Treat manifests as stable published metadata.
- Use the verb schema files for exact request and receipt contracts.
