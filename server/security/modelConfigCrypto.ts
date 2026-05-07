import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const DEV_SECRET = "jobcopilot-dev-model-config-secret";

export function encryptModelApiKey(apiKey: string) {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  const encrypted = Buffer.concat([cipher.update(apiKey, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [iv, authTag, encrypted].map((part) => part.toString("base64url")).join(".");
}

export function decryptModelApiKey(encryptedValue: string) {
  const key = getEncryptionKey();
  const [ivText, authTagText, encryptedText] = encryptedValue.split(".");

  if (!ivText || !authTagText || !encryptedText) {
    throw new Error("Invalid encrypted API key format.");
  }

  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivText, "base64url"), {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(Buffer.from(authTagText, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedText, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export function getModelConfigSecretWarning() {
  if (process.env.MODEL_CONFIG_SECRET) return null;
  if (process.env.NODE_ENV === "production") {
    return "MODEL_CONFIG_SECRET is required in production.";
  }
  return "MODEL_CONFIG_SECRET is not set. Development fallback encryption key is being used.";
}

function getEncryptionKey() {
  const secret = process.env.MODEL_CONFIG_SECRET;

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("MODEL_CONFIG_SECRET is required to encrypt model API keys.");
  }

  return createHash("sha256").update(secret || DEV_SECRET).digest();
}
