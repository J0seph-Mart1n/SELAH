import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "selah_admin_session";

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "selah2026admin";
const ADMIN_SECRET =
  process.env.ADMIN_SECRET ||
  process.env.FIREBASE_API_KEY ||
  "selah-2026-admin-secure-auth-secret";

/**
 * Verify given username and password against configured admin credentials.
 */
export function verifyAdminCredentials(user?: string, pass?: string): boolean {
  if (!user || !pass) return false;
  return user.trim() === ADMIN_USERNAME.trim() && pass.trim() === ADMIN_PASSWORD.trim();
}

/**
 * Generate a cryptographically signed HMAC session token.
 */
export function generateSessionToken(): string {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(`${ADMIN_USERNAME}:${timestamp}`)
    .digest("hex");
  return `${timestamp}.${signature}`;
}

/**
 * Verify HMAC session token authenticity and check for expiration (7 days).
 */
export function verifySessionToken(token?: string | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [timestampStr, providedSig] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Session valid for 7 days
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > maxAgeMs) return false;

  const expectedSig = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(`${ADMIN_USERNAME}:${timestampStr}`)
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
 * Helper to check whether the incoming request is authenticated as admin via cookies.
 */
export async function isAuthenticatedAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
    if (!sessionCookie?.value) return false;
    return verifySessionToken(sessionCookie.value);
  } catch {
    return false;
  }
}
