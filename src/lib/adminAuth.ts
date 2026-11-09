import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "selah_admin_session";

// Fallback default admin credentials (in case Vercel production environment variables are not yet configured)
const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "admin@selah2026";
const DEFAULT_ADMIN_SECRET = "77d26161d1f3fe5eeccde794110ba6954ecc27a6ddb7bf5e0ab41562f883980f";

export function getAdminUsername(): string {
  return (process.env.ADMIN_USERNAME || "").trim() || DEFAULT_ADMIN_USERNAME;
}

export function getAdminPassword(): string {
  return (process.env.ADMIN_PASSWORD || "").trim() || DEFAULT_ADMIN_PASSWORD;
}

export function getAdminSecret(): string {
  return (
    (process.env.ADMIN_SECRET || "").trim() ||
    (process.env.ADMIN_PASSWORD || "").trim() ||
    DEFAULT_ADMIN_SECRET
  );
}

// Keep exported constants for backwards compatibility, resolving at runtime
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

/**
 * Verify given username and password against configured admin credentials.
 * Resilient to missing Vercel environment variables by falling back to defaults.
 */
export function verifyAdminCredentials(user?: string, pass?: string): boolean {
  if (!user || !pass) return false;

  const expectedUser = getAdminUsername();
  const expectedPass = getAdminPassword();

  if (!expectedUser || !expectedPass) return false;

  const userHash = crypto.createHash("sha256").update(user.trim()).digest();
  const expectedUserHash = crypto.createHash("sha256").update(expectedUser).digest();
  const passHash = crypto.createHash("sha256").update(pass.trim()).digest();
  const expectedPassHash = crypto.createHash("sha256").update(expectedPass).digest();

  const userMatch = crypto.timingSafeEqual(userHash, expectedUserHash);
  const passMatch = crypto.timingSafeEqual(passHash, expectedPassHash);
  return userMatch && passMatch;
}

/**
 * Generate a cryptographically signed HMAC session token.
 */
export function generateSessionToken(): string {
  const secret = getAdminSecret();
  const username = getAdminUsername();

  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${username}:${timestamp}`)
    .digest("hex");
  return `${timestamp}.${signature}`;
}

/**
 * Verify HMAC session token authenticity and check for expiration (7 days).
 */
export function verifySessionToken(token?: string | null): boolean {
  if (!token) return false;

  const secret = getAdminSecret();
  const username = getAdminUsername();

  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [timestampStr, providedSig] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Session valid for 7 days
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > maxAgeMs) return false;

  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(`${username}:${timestampStr}`)
    .digest("hex");

  try {
    const providedBuffer = Buffer.from(providedSig, "hex");
    const expectedBuffer = Buffer.from(expectedSig, "hex");
    if (providedBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

/**
 * Helper to check whether the incoming request is authenticated as admin.
 * Supports:
 * 1. Authorization: Bearer <token> header (immune to cross-domain / Safari ITP / Vercel cookie drops)
 * 2. Next.js HttpOnly session cookie
 */
export async function isAuthenticatedAdmin(request?: Request): Promise<boolean> {
  // 1. Check Authorization header
  if (request) {
    try {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
        const bearerToken = authHeader.substring(7).trim();
        if (verifySessionToken(bearerToken)) {
          return true;
        }
      }
    } catch {
      // ignore header reading error
    }
  }

  // 2. Check Cookie
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
    if (sessionCookie?.value && verifySessionToken(sessionCookie.value)) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}
