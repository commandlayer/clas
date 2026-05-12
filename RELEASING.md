# Releasing

## Schema Versioning

CLAS schemas follow semantic versioning at the family level. `trust-verification` is currently at `1.0.0`.

| Bump | When |
|------|------|
| Patch (1.0.x) | Description/documentation changes only — no structural change |
| Minor (1.x.0) | New optional fields, new verbs — backwards compatible |
| Major (x.0.0) | Required field changes, field renames, removed fields — breaking |

## Release Process

1. Update schema files under `schemas/trust-verification/`
2. Update `version` in `schemas/trust-verification/manifest.json`
3. Update the mirror under `schemas/v<version>/trust-verification/`
4. Regenerate `checksums.txt`:
   ```sh
   find schemas -name "*.json" | sort | xargs sha256sum > checksums.txt
   ```
5. Update `CHANGELOG.md`
6. Commit, push, and create a git tag:
   ```sh
   git tag -a v1.0.0 -m "trust-verification v1.0.0"
   git push origin v1.0.0
   ```
7. Publish `@commandlayer/clas-validator`:
   ```sh
   cd packages/clas-validator
   npm run build
   npm publish --access public
   ```

## Adding a New Family

A family is only added to `manifest.json` and `schemas/` when:

1. At least one verb has complete `request.schema.json`, `receipt.schema.json`, and `examples/` with valid/tampered/invalid fixtures
2. CI passes for all verb examples
3. `manifest.json` for the family is present and valid

Do not create stub directories for planned families — use `docs/ROADMAP.md` instead.
