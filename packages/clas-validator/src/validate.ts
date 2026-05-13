import Ajv2020, { ErrorObject, ValidateFunction } from "ajv/dist/2020";
import addFormats from "ajv-formats";
import path from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import {
  ClasTrustVerificationVerb,
  ValidationResult,
} from "./types";

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

// Pre-load shared proof schema so $ref in receipt schemas resolves correctly
const PROOF_SCHEMA_PATH = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "schemas",
  "trust-verification",
  "_shared",
  "proof.schema.json",
);
if (existsSync(PROOF_SCHEMA_PATH)) {
  const proofSchema = JSON.parse(readFileSync(PROOF_SCHEMA_PATH, "utf8"));
  proofSchema.$id = pathToFileURL(PROOF_SCHEMA_PATH).href;
  ajv.addSchema(proofSchema);
}

const schemaCache = new Map<string, ValidateFunction>();

function formatAjvError(error: ErrorObject): string {
  const location = error.instancePath || "/";
  return `${location} ${error.message ?? "is invalid"}`;
}

function getSchemaPath(
  verb: ClasTrustVerificationVerb,
  kind: "request" | "receipt",
): string {
  return path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "schemas",
    "trust-verification",
    verb,
    `${verb}.${kind}.schema.json`,
  );
}

function getValidator(
  verb: ClasTrustVerificationVerb,
  kind: "request" | "receipt",
): ValidateFunction {
  const key = `${verb}:${kind}`;
  const existing = schemaCache.get(key);
  if (existing) {
    return existing;
  }

  const schemaPath = getSchemaPath(verb, kind);
  if (!existsSync(schemaPath)) {
    throw new Error(
      `Schema file not found for ${key}: ${schemaPath}. This validator currently expects to run from within the CLAS repository layout.`,
    );
  }

  // For receipt schemas, pre-load the sibling request schema so relative $refs resolve
  if (kind === "receipt") {
    const reqPath = getSchemaPath(verb, "request");
    const reqId = pathToFileURL(reqPath).href;
    if (existsSync(reqPath) && !ajv.getSchema(reqId)) {
      const reqSchema = JSON.parse(readFileSync(reqPath, "utf8"));
      reqSchema.$id = reqId;
      ajv.addSchema(reqSchema);
    }
  }

  const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
  schema.$id = pathToFileURL(schemaPath).href;
  const validator = ajv.compile(schema);
  schemaCache.set(key, validator);
  return validator;
}

function validateByKind(
  verb: ClasTrustVerificationVerb,
  data: unknown,
  kind: "request" | "receipt",
): ValidationResult {
  const validator = getValidator(verb, kind);
  const valid = Boolean(validator(data));
  const errors = valid
    ? []
    : (validator.errors ?? []).map((error) => formatAjvError(error));

  return { valid, errors };
}


export function validateTrustRequest(
  verb: ClasTrustVerificationVerb,
  data: unknown,
): ValidationResult {
  return validateByKind(verb, data, "request");
}

export function validateTrustReceipt(
  verb: ClasTrustVerificationVerb,
  data: unknown,
): ValidationResult {
  return validateByKind(verb, data, "receipt");
}

export function assertValidTrustRequest(
  verb: ClasTrustVerificationVerb,
  data: unknown,
): void {
  const result = validateTrustRequest(verb, data);
  if (!result.valid) {
    throw new Error(
      `Invalid trust request for '${verb}': ${result.errors.join("; ")}`,
    );
  }
}

export function assertValidTrustReceipt(
  verb: ClasTrustVerificationVerb,
  data: unknown,
): void {
  const result = validateTrustReceipt(verb, data);
  if (!result.valid) {
    throw new Error(
      `Invalid trust receipt for '${verb}': ${result.errors.join("; ")}`,
    );
  }
}
