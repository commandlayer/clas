# @clas/clas-validator

Minimal TypeScript validator scaffold for CLAS Trust Verification schemas.

## Scope

This package validates **JSON schema shape only** for trust verification requests and receipts.

It **does not** verify cryptographic signatures, key ownership, issuer trust, or tamper-proofing.

## Supported verbs

- verify
- authenticate
- authorize
- attest
- sign
- permit
- grant
- approve
- reject
- endorse

## Install (repo-local)

```bash
cd packages/clas-validator
npm install
npm run build
```

## Usage

```ts
import {
  validateTrustRequest,
  validateTrustReceipt,
  assertValidTrustRequest,
  assertValidTrustReceipt,
  type ClasTrustVerificationVerb,
} from "@clas/clas-validator";

const verb: ClasTrustVerificationVerb = "verify";

const requestResult = validateTrustRequest(verb, requestPayload);
if (!requestResult.valid) {
  console.error(requestResult.errors);
}

assertValidTrustReceipt(verb, receiptPayload);
```

## Schema loading behavior

Schemas are currently loaded at runtime from filesystem paths in the CLAS repository:

`schemas/trust-verification/<verb>/<verb>.(request|receipt).schema.json`

This is intentionally a simple, maintainable repo-local scaffold. If you publish this package outside the repository layout, you must add packaged schema assets or a custom schema loader.
