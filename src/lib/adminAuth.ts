import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "selah_admin_session";

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

/**
 * Verify given username and password against configured admin credentials.
 * Fails closed if ADMIN_USERNAME or ADMIN_PASSWORD are not configured.
 */
export function verifyAdminCredentials(user?: string, pass?: string): boolean {
  if (!user || !pass || !ADMIN_USERNAME || !ADMIN_PASSWORD) return false;

  const userHash = crypto.createHash("sha256").update(user.trim()).digest();
  const expectedUserHash = crypto.createHash("sha256").update(ADMIN_USERNAME.trim()).digest();
  const passHash = crypto.createHash("sha256").update(pass.trim()).digest();
  const expectedPassHash = crypto.createHash("sha256").update(ADMIN_PASSWORD.trim()).digest();

  const userMatch = crypto.timingSafeEqual(userHash, expectedUserHash);
  const passMatch = crypto.timingSafeEqual(passHash, expectedPassHash);
  return userMatch && passMatch;
}

/**
 * Generate a cryptographically signed HMAC session token.
 */
export function generateSessionToken(): string {
  if (!ADMIN_SECRET || !ADMIN_USERNAME) {
    throw new Error("Admin authentication environment variables (ADMIN_USERNAME, ADMIN_SECRET) are not configured.");
  }
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
  if (!token || !ADMIN_SECRET || !ADMIN_USERNAME) return false;
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
