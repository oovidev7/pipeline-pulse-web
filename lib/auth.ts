// Uses the Web Crypto API (globalThis.crypto.subtle) instead of Node's
// `crypto` module so this file can run in both the Node.js runtime (API
// routes) and the Edge Runtime (middleware) without bundler warnings.

const COOKIE_NAME = "pp_session";
const COOKIE_VALUE = "authenticated";

function toBase64Url(bytes: ArrayBuffer): string {
  const bin = Array.from(new Uint8Array(bytes))
    .map((b) => String.fromCharCode(b))
    .join("");
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return globalThis.crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

/** Signs a fixed value with ADMIN_SECRET using HMAC-SHA256, base64url encoded. */
async function sign(value: string, secret: string): Promise<string> {
  const key = await importHmacKey(secret);
  const enc = new TextEncoder();
  const signature = await globalThis.crypto.subtle.sign("HMAC", key, enc.encode(value));
  return toBase64Url(signature);
}

/** Builds the cookie value (payload + signature) to set on successful login. */
export async function createSignedCookieValue(): Promise<string> {
  const secret = process.env.ADMIN_SECRET || "";
  const signature = await sign(COOKIE_VALUE, secret);
  return `${COOKIE_VALUE}.${signature}`;
}

/** Verifies a cookie value against ADMIN_SECRET. */
export async function verifySignedCookieValue(
  cookieValue: string | undefined | null
): Promise<boolean> {
  if (!cookieValue) return false;
  const secret = process.env.ADMIN_SECRET || "";
  if (!secret) return false;
  const [payload, signature] = cookieValue.split(".");
  if (!payload || !signature) return false;
  const expected = await sign(payload, secret);
  // Simple constant-time-ish comparison (lengths checked first).
  if (signature.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < signature.length; i++) {
    diff |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0 && payload === COOKIE_VALUE;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
