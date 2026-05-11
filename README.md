# CLAS — Canonical Layer Action Schemas

CLAS is an open schema and specification repository for interoperable machine actions. It defines canonical request and receipt structures that can be validated, exchanged, and independently verified across systems, runtimes, and chains.

## What CLAS provides

- **Action schemas** — canonical `request` and `receipt` JSON schemas per verb
- **Verifiable receipts** — deterministic, hashable, Ed25519-signed artifacts
- **Family manifests** — machine-readable indexes of actions per domain
- **MCP and OpenAPI descriptors** — for select verbs in the `trust-verification` family
- **A TypeScript validator** — schema-shape validation for trust-verification requests and receipts

## Repo structure

```
schemas/                        # All schema families
  trust-verification/           # Active family — request/receipt schemas and examples
    manifest.json
    verify/
    authenticate/
    authorize/
    attest/
    sign/
    permit/
    grant/
    approve/
    reject/
    endorse/
    _shared/                    # Shared proof schema
  commerce-payments/            # Planned family
  communication-outreach/       # Planned family
  content-creation/             # Planned family
  data-analytics/               # Planned family
  identity-compliance/          # Planned family
  lifecycle-management/         # Planned family
  logistics-fulfillment/        # Planned family
  training-optimization/        # Planned family
  workflow-approval/            # Planned family

packages/
  clas-validator/               # TypeScript schema-shape validator (trust-verification)

docs/                           # Design and integration documentation
scripts/                        # Validation utilities
manifest.json                   # Root index of all CLAS schema families
```

## Schema families

| Family | Status | Description |
|---|---|---|
| `trust-verification` | draft-v1 | Verify, authenticate, authorize, attest, sign, permit, grant, approve, reject, endorse |
| `commerce-payments` | planned | Payments, invoices, escrow, settlement |
| `communication-outreach` | planned | Email, messaging, notifications, broadcasts |
| `content-creation` | planned | Generate, translate, publish, format content |
| `data-analytics` | planned | Analyze, extract, transform, classify data |
| `identity-compliance` | planned | KYC, screening, credentials, audit |
| `lifecycle-management` | planned | Register, revoke, delegate, archive |
| `logistics-fulfillment` | planned | Ship, track, route, schedule |
| `training-optimization` | planned | Train, evaluate, finetune, benchmark |
| `workflow-approval` | planned | Approve, reject, schedule, cancel workflows |

## Quick start — validator

```bash
cd packages/clas-validator
npm install
npm run build
```

```ts
import { validateTrustRequest, validateTrustReceipt } from "@clas/clas-validator";

const result = validateTrustRequest("verify", payload);
if (!result.valid) console.error(result.errors);
```

Supported verbs: `verify`, `authenticate`, `authorize`, `attest`, `sign`, `permit`, `grant`, `approve`, `reject`, `endorse`.

## Verification model

CLAS receipts are deterministic verification artifacts:

- **Canonicalization**: `json.sorted_keys.v1`
- **Hash**: SHA-256 over canonical payload
- **Signature**: Ed25519
- **Independent verification**: receipts can be verified locally without a hosted service

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).
