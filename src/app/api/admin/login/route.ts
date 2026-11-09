import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  generateSessionToken,
  verifyAdminCredentials,
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body || {};

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required." },
        { status: 400 }
      );
    }

    if (!verifyAdminCredentials(username, password)) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password. Please try again." },
        { status: 401 }
      );
    }

    const token = generateSessionToken();

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful.",
      token,
    });

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProduction,
      path: "/",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    };

    // 1. Set on outgoing NextResponse directly to guarantee Set-Cookie header
    response.cookies.set(cookieOptions);

    // 2. Also set on cookieStore for Next.js internal context
    try {
      const cookieStore = await cookies();
      cookieStore.set(cookieOptions);
    } catch (cookieErr) {
      console.warn("[Admin Login] cookieStore.set warning:", cookieErr);
    }

    return response;
  } catch (error: any) {
    console.error("[Admin Login Error]:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
