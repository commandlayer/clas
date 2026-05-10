# CommandLayer CLAS Trust Schemas

Repo-ready schema pack for the CLAS Trust family.

## Path pattern

```text
schemas/v1.0.0/trust/<verb>/<verb>.request.schema.json
schemas/v1.0.0/trust/<verb>/<verb>.receipt.schema.json
```

## Verbs

- verify
- authorize
- attest
- endorse
- sign
- permit
- grant
- reject
- approve

## Receipt proof model

Every receipt schema requires:

```json
{
  "canonicalization": "json.sorted_keys.v1",
  "hash": "sha256:<64-char-hex>",
  "signature_alg": "ed25519",
  "signature": "<base64url-signature>",
  "key_id": "<kid>",
  "signer": "<ens-or-did-or-runtime-id>"
}
```

## Validate

```bash
python scripts/validate_json.py
```
