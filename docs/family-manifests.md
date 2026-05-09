# CLAS Family Manifests

Each family has a `manifest.v1.json` that acts as the canonical index for that family.

## Manifest fields

Each manifest includes:
- `family`
- `version`
- `description`
- `actions`
- `status`
- `receipt_required`
- `verification_required`
- `canonicalization`
- `hash`
- `signature_algorithm`

## How to use

- Use manifests to discover actions in a family.
- Treat manifests as stable published metadata.
- Use action schemas for exact input/output/receipt contracts.
