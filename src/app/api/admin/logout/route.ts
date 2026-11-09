import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Admin logged out successfully.",
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: "",
      path: "/",
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    try {
      const cookieStore = await cookies();
      cookieStore.delete(ADMIN_COOKIE_NAME);
    } catch {
      // ignore
    }

    return response;
  } catch (error: any) {
    console.error("[Admin Logout Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log out." },
      { status: 500 }
    );
  }
}
