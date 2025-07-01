import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export async function middleware(request: NextRequest) {
  const isHomePage = request.nextUrl.pathname === "/";

  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!token) return NextResponse.next();

  try {
    const { payload } = await jwtVerify(token, secret);

    // Optional debug
    console.log("[Middleware] JWT Payload:", payload);

    if (isHomePage && payload?.membership) {
      return NextResponse.redirect(new URL("/map", request.url));
    }
  } catch (err) {
    console.error("[Middleware] JWT error:", err);
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/'],
};