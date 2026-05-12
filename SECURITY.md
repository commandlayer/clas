# Security Policy

## Scope

This repository defines JSON schemas for the CommandLayer Action Schema (CLAS) protocol and publishes the `@commandlayer/clas-validator` package. Schemas are consumed by cryptographic signing and verification systems across the CommandLayer ecosystem.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.0   | ✓         |

## Reporting a Vulnerability

To report a security vulnerability in schema definitions or the `@commandlayer/clas-validator` package:

1. **Do not open a public GitHub issue.**
2. Email **security@commandlayer.org** with:
   - A description of the vulnerability
   - The schema family and verb affected
   - Steps to reproduce or a proof-of-concept
   - The potential impact on signing/verification systems

You will receive acknowledgement within 48 hours.

## Known Limitations

- **No schema revocation.** Once a schema version is published, there is no mechanism to invalidate receipts that validated against it. Schema versions are append-only; breaking changes require a new version identifier.
- **`additionalProperties: false` enforcement.** All schemas reject unknown fields at the top level. Implementations must not rely on extension fields outside defined properties.
- **Schema integrity.** The `checksums.txt` file provides SHA-256 checksums for all schema files. Consumers should validate checksums when fetching schemas from the network.
- **Proof field binding.** The `proof` object in receipts binds to the canonicalized receipt body. Schema validation alone does not verify the cryptographic signature — that requires the runtime verifier.
