# CLAS Runtime Stack Alignment Audit

Date: 2026-05-18
Branch: align/clas-to-canonical-runtime-stack

## Files changed
- Trust verification shared proof schema and all trust-verification receipt schemas.
- Trust verification receipt examples across approve/attest/authenticate/authorize/endorse/grant/permit/reject/sign/verify.
- Documentation updates:
  - `schemas/trust-verification/README.md`
  - `docs/mcp-compatibility.md`

## Stale fields found
The following stale proof fields were found and replaced in schemas/examples:
- `receipt.proof`
- `proof.canonical`
- `proof.alg`
- `proof.signature`
- `proof.kid`
- `proof.signer_id`
- lowercase-only `ed25519`

Not found in the trust-verification schema/examples payloads audited:
- `hash_sha256`
- `signature_b64`

## Schemas updated
- Receipt schemas now require `metadata` with required `metadata.proof` object.
- Shared proof schema now enforces canonical shape:
  - `metadata.proof.canonicalization = "json.sorted_keys.v1"`
  - `metadata.proof.hash.alg = "SHA-256"`
  - `metadata.proof.hash.value = <64 hex chars>`
  - `metadata.proof.signature.alg = "Ed25519"`
  - `metadata.proof.signature.value = <string>`
  - `metadata.proof.signature.kid = <string>`

## Examples updated
- All trust-verification `*.receipt.json` examples were migrated from top-level `proof` to `metadata.proof`.
- Invalid examples were preserved as schema-invalid fixtures by using invalid proof content where required.

## Checks run
- `npm install` ✅
- `npm run build` ❌ (script missing in package.json)
- `npm test` ✅
- `npm run validate` ✅

## Release blockers
- `npm run build` script does not exist in this repository; build check cannot run as requested.

## Draft-v1 readiness
- **Ready for draft-v1 tag with caveat**: schema/example alignment for canonical proof envelope is complete and validation passes.
- Caveat: missing build script should be addressed or explicitly waived in release criteria.
