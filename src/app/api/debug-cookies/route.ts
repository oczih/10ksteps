import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log("[DEBUG] Debug cookies endpoint called");
  
  // Get all cookies
  const cookies = request.cookies;
  const allCookies = Array.from(cookies.getAll());
  
  console.log("[DEBUG] Total cookies received:", allCookies.length);
  console.log("[DEBUG] Cookie names:", allCookies.map(c => c.name));
  
  // Check for NextAuth cookies specifically
  const sessionToken = cookies.get("__Secure-next-auth.session-token");
  const regularSessionToken = cookies.get("next-auth.session-token");
  const csrfToken = cookies.get("__Host-authjs.csrf-token");
  
  console.log("[DEBUG] __Secure-next-auth.session-token exists:", !!sessionToken);
  console.log("[DEBUG] next-auth.session-token exists:", !!regularSessionToken);
  console.log("[DEBUG] __Host-authjs.csrf-token exists:", !!csrfToken);
  
  if (sessionToken) {
    console.log("[DEBUG] Session token length:", sessionToken.value.length);
    console.log("[DEBUG] Session token preview:", sessionToken.value.substring(0, 50) + "...");
  }
  
  // Check headers
  const cookieHeader = request.headers.get('cookie');
  console.log("[DEBUG] Cookie header exists:", !!cookieHeader);
  if (cookieHeader) {
    console.log("[DEBUG] Cookie header preview:", cookieHeader.substring(0, 100) + "...");
  }
  
  return NextResponse.json({
    totalCookies: allCookies.length,
    cookieNames: allCookies.map(c => c.name),
    hasSessionToken: !!sessionToken,
    hasRegularSessionToken: !!regularSessionToken,
    hasCsrfToken: !!csrfToken,
    sessionTokenLength: sessionToken?.value.length || 0,
    cookieHeaderExists: !!cookieHeader
  });
} 