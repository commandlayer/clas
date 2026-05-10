import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const baseDir = path.join(repoRoot, 'schemas', 'trust-verification');

const EXPECTATIONS = [
  { file: 'valid.request.json', schemaType: 'request', shouldPass: true },
  { file: 'valid.receipt.json', schemaType: 'receipt', shouldPass: true },
  { file: 'tampered.receipt.json', schemaType: 'receipt', shouldPass: true },
  { file: 'invalid.receipt.json', schemaType: 'receipt', shouldPass: false },
];

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(baseDir)) {
  fail(`Missing directory: ${baseDir}`);
}

const entries = fs
  .readdirSync(baseDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== '_shared')
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

  if (!fs.existsSync(proofSchemaPath)) fail(`[${verb}] Missing shared schema: ${proofSchemaPath}`);

  requestSchema.$id ??= pathToFileURL(requestSchemaPath).href;
  receiptSchema.$id ??= pathToFileURL(receiptSchemaPath).href;

  const proofSchema = JSON.parse(fs.readFileSync(proofSchemaPath, 'utf8'));
  proofSchema.$id ??= pathToFileURL(proofSchemaPath).href;

  ajv.addSchema(proofSchema);
  ajv.addSchema(requestSchema);
  ajv.addSchema(receiptSchema);

  const validateRequest = ajv.getSchema(requestSchema.$id) || ajv.compile(requestSchema);
  const validateReceipt = ajv.getSchema(receiptSchema.$id) || ajv.compile(receiptSchema);

  let verbFailed = false;
  console.log(`\n[${verb}]`);

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
    console.log(`  ${status} ${file} (${schemaType}) expected ${expected}, got ${got}`);

    if (!expectationMet && validate.errors?.length) {
      for (const err of validate.errors) {
        console.log(`    - ${err.instancePath || '/'} ${err.message}`);
      }
    }
  }

  console.log(`  Summary: ${verbFailed ? 'FAIL' : 'PASS'}`);
}

if (hasExpectationFailures) {
  console.error('\nOne or more verbs failed expected validation outcomes.');
  process.exit(1);
}

console.log('\nAll trust-verification example validations matched expected outcomes.');
