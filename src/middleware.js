import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/verifyotp") ||
    pathname.startsWith("/api/auth") // This should cover all auth routes
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    // jose expects the secret as a Uint8Array
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return NextResponse.next();
  } catch (err) {
    console.error("JWT error:", err);
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|api/auth|api/hello|api/testfirebase|api/testsupabase|signin|signup).*)",
  ],
};
