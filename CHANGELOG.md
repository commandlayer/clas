# Changelog

All notable changes to CLAS (CommandLayer Action Schema) are documented here.

## [1.0.0] — 2026-05-12

### Added
- `trust-verification` action family with 10 verbs: verify, authenticate, authorize, attest, sign, permit, grant, approve, reject, endorse
- Shared `_shared/proof.schema.json` with aligned proof field names (`alg`, `kid`, `signer_id`)
- Schema mirror at `schemas/v1.0.0/` matching the URL path structure that `runtime-core/schema-client.ts` fetches
- `packages/clas-validator` — TypeScript validator with CLI entrypoint (`clas-validate`)
- CI via `.github/workflows/ci.yml` — schema validation on every push and PR
- `.gitignore`, `SECURITY.md`, `RELEASING.md`
- `docs/ROADMAP.md` for planned families

### Changed
- Proof schema field names aligned with ecosystem standard: `signature_alg` → `alg`, `key_id` → `kid`, `signer` → `signer_id`
- `packages/clas-validator` renamed from `@clas/clas-validator` to `@commandlayer/clas-validator` and bumped to `1.0.0`
- Root `manifest.json` now lists only `trust-verification` (the only family with actual schemas)
- All 10 verb example files (`valid.receipt.json`, `tampered.receipt.json`) updated to use new proof field names

### Removed
- 9 empty stub family directories: `commerce-payments`, `communication-outreach`, `content-creation`, `data-analytics`, `identity-compliance`, `lifecycle-management`, `logistics-fulfillment`, `training-optimization`, `workflow-approval` — moved to `docs/ROADMAP.md`
- `.tmp-test` artifact from repo root
