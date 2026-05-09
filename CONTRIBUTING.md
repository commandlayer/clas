# Contributing to CLAS

CLAS is an open schema and specification repository for interoperable machine actions.

## Scope

CLAS accepts:
- action schemas
- manifests
- request examples
- response examples
- receipt examples
- verification rules
- documentation

CLAS does not accept:
- runtime-specific business logic
- chain-specific lock-in
- proprietary transport assumptions
- closed discovery systems

## Design principles

All CLAS actions should:
- be network-agnostic
- emit verifiable receipts
- support canonical JSON hashing
- support independent verification
- separate transport from trust
- prefer stable action naming

## Schema rules

Every action folder should include:

- README.md
- schema.v1.json
- request.example.json
- response.example.json
- receipt.example.json

## Verification requirements

Current CLAS verification defaults:

- canonicalization: json.sorted_keys.v1
- hash: SHA-256
- signature algorithm: Ed25519
- receipt schema: cl.receipt.v1

## Versioning

CLAS uses semantic versioning.

Examples:
- clas.verify.v1
- clas.verify.v1.1
- CLAS v1.0.0

## Naming guidance

Action names should:
- be stable
- be implementation-neutral
- describe machine behavior clearly
- avoid vendor branding
- avoid unnecessary synonyms

## Pull requests

Contributors should:
- keep schemas minimal
- provide examples
- document verification behavior
- avoid introducing network dependencies
