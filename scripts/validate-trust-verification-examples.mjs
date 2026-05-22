import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const baseDir = path.join(repoRoot, 'schemas', 'trust-verification');

// EXPECTATIONS per example file:
// - valid.request.json:   schema-valid request          -> shouldPass: true
// - valid.receipt.json:   schema-valid receipt           -> shouldPass: true
// - tampered.receipt.json: schema-valid but the receipt
//   payload has been semantically tampered (e.g. result
//   field changed after signing). It must still be
//   schema-valid — cryptographic invalidity is checked
//   by a separate verifier, not the JSON schema layer.
// - invalid.receipt.json: schema-invalid receipt        -> shouldPass: false
const EXPECTATIONS = [
  { file: 'valid.request.json', schemaType: 'request', shouldPass: true },
  { file: 'valid.receipt.json', schemaType: 'receipt', shouldPass: true },
  { file: 'tampered.receipt.json', schemaType: 'receipt', shouldPass: true },
  { file: 'invalid.receipt.json', schemaType: 'receipt', shouldPass: false },
];

function fail(msg) {
  process.stderr.write(`ERROR: ${msg}\n`);
  process.exit(1);
}

if (!fs.existsSync(baseDir)) {
  fail(`Missing directory: ${baseDir}`);
}

const entries = fs
  .readdirSync(baseDir, { withFileTypes: true })
  .filter((d) => {
    if (!d.isDirectory() || d.name === '_shared') return false;
    // Skip dirs that don't have the expected verb schema structure
    const verbDir = path.join(baseDir, d.name);
    return fs.existsSync(path.join(verbDir, `${d.name}.request.schema.json`));
  })
  .map((d) => d.name)
  .sort();

if (entries.length === 0) {
  fail(`No verbs found under ${baseDir}`);
}

let hasExpectationFailures = false;

for (const verb of entries) {
  const verbDir = path.join(baseDir, verb);
  const examplesDir = path.join(verbDir, 'examples');
  const requestSchemaPath = path.join(verbDir, `${verb}.request.schema.json`);
  const receiptSchemaPath = path.join(verbDir, `${verb}.receipt.schema.json`);

  if (!fs.existsSync(examplesDir)) fail(`[${verb}] Missing examples folder: ${examplesDir}`);
  if (!fs.existsSync(requestSchemaPath)) fail(`[${verb}] Missing request schema: ${requestSchemaPath}`);
  if (!fs.existsSync(receiptSchemaPath)) fail(`[${verb}] Missing receipt schema: ${receiptSchemaPath}`);

  const ajv = new Ajv2020({ allErrors: true, strict: false, validateFormats: true });
  addFormats(ajv);

  const requestSchema = JSON.parse(fs.readFileSync(requestSchemaPath, 'utf8'));
  const receiptSchema = JSON.parse(fs.readFileSync(receiptSchemaPath, 'utf8'));
  const proofSchemaPath = path.join(baseDir, '_shared', 'proof.schema.json');
  const traceSchemaPath = path.join(baseDir, '_shared', 'trace.schema.json');

  if (!fs.existsSync(proofSchemaPath)) fail(`[${verb}] Missing shared schema: ${proofSchemaPath}`);
  if (!fs.existsSync(traceSchemaPath)) fail(`[${verb}] Missing shared schema: ${traceSchemaPath}`);

  requestSchema.$id ??= pathToFileURL(requestSchemaPath).href;
  receiptSchema.$id ??= pathToFileURL(receiptSchemaPath).href;

  const proofSchema = JSON.parse(fs.readFileSync(proofSchemaPath, 'utf8'));
  const traceSchema = JSON.parse(fs.readFileSync(traceSchemaPath, 'utf8'));
  proofSchema.$id ??= pathToFileURL(proofSchemaPath).href;
  traceSchema.$id ??= pathToFileURL(traceSchemaPath).href;

  ajv.addSchema(traceSchema);
  ajv.addSchema(proofSchema);
  ajv.addSchema(requestSchema);
  ajv.addSchema(receiptSchema);

  const validateRequest = ajv.getSchema(requestSchema.$id) || ajv.compile(requestSchema);
  const validateReceipt = ajv.getSchema(receiptSchema.$id) || ajv.compile(receiptSchema);

  const validateProof = ajv.getSchema(proofSchema.$id) || ajv.compile(proofSchema);
  const metadataSchema = receiptSchema.properties?.metadata;
  if (!metadataSchema) fail(`[${verb}] Receipt schema missing metadata property`);
  const metadataSchemaResolved = JSON.parse(JSON.stringify(metadataSchema));
  if (metadataSchemaResolved.properties?.proof?.$ref) metadataSchemaResolved.properties.proof.$ref = proofSchema.$id;
  if (metadataSchemaResolved.properties?.trace?.$ref) metadataSchemaResolved.properties.trace.$ref = traceSchema.$id;
  const validateMetadata = ajv.compile(metadataSchemaResolved);

  const proofSingle = {
    canonicalization: 'json.sorted_keys.v1',
    hash: { alg: 'SHA-256', value: 'a'.repeat(64) },
    signature: { alg: 'Ed25519', value: 'signaturevalue1234', kid: 'key-1' },
  };
  const proofComposable = {
    canonicalization: 'erc8211.composable.v1',
    hash: { alg: 'SHA-256', value: 'b'.repeat(64) },
    signature: [
      { alg: 'Ed25519', value: 'signaturevalue1234', kid: 'key-1', role: 'solver' },
    ],
  };

  const schemaChecks = [
    { name: 'proof single-signature json.sorted_keys.v1', ok: validateProof(proofSingle) },
    { name: 'proof erc8211.composable.v1 with signature role array', ok: validateProof(proofComposable) },
    { name: 'metadata proof only', ok: validateMetadata({ proof: proofSingle }) },
    { name: 'metadata proof + trace', ok: validateMetadata({ proof: proofSingle, trace: { trace_id: 'trace-1', span_id: 'span-1' } }) },
    { name: 'metadata unknown extra field rejected', ok: !validateMetadata({ proof: proofSingle, extra: true }) },
  ];


  let verbFailed = false;
  process.stdout.write(`\n[${verb}]\n`);

  for (const check of schemaChecks) {
    const status = check.ok ? 'PASS' : 'FAIL';
    process.stdout.write(`  ${status} schema-check ${check.name}\n`);
    if (!check.ok) {
      verbFailed = true;
      hasExpectationFailures = true;
    }
  }

  for (const { file, schemaType, shouldPass } of EXPECTATIONS) {
    const targetPath = path.join(examplesDir, file);
    if (!fs.existsSync(targetPath)) fail(`[${verb}] Missing example file: ${targetPath}`);

    const payload = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    const validate = schemaType === 'request' ? validateRequest : validateReceipt;
    const ok = validate(payload);
    const expectationMet = Boolean(ok) === shouldPass;

    if (!expectationMet) {
      verbFailed = true;
      hasExpectationFailures = true;
    }

    const status = expectationMet ? 'PASS' : 'FAIL';
    const expected = shouldPass ? 'valid' : 'invalid';
    const got = ok ? 'valid' : 'invalid';
    process.stdout.write(`  ${status} ${file} (${schemaType}) expected ${expected}, got ${got}\n`);

    if (!expectationMet && validate.errors?.length) {
      for (const err of validate.errors) {
        process.stdout.write(`    - ${err.instancePath || '/'} ${err.message}\n`);
      }
    }
  }

  process.stdout.write(`  Summary: ${verbFailed ? 'FAIL' : 'PASS'}\n`);
}

if (hasExpectationFailures) {
  process.stderr.write('\nOne or more verbs failed expected validation outcomes.\n');
  process.exit(1);
}

process.stdout.write('\nAll trust-verification example validations matched expected outcomes.\n');
