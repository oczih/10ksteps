import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@auth/core/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(request: NextRequest) {
  console.log("[TEST] Testing authentication...");
  console.log("[TEST] NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET);
  console.log("[TEST] NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
  
  // Debug cookies
  const cookies = request.cookies;
  const cookieNames = Array.from(cookies.getAll()).map(cookie => cookie.name);
  console.log("[TEST] Available cookies:", cookieNames);
  
  const sessionToken = cookies.get("__Secure-next-auth.session-token")?.value || 
                      cookies.get("next-auth.session-token")?.value;
  console.log("[TEST] Session token found:", !!sessionToken);
  
  if (sessionToken) {
    console.log("[TEST] Session token preview:", sessionToken.substring(0, 50) + "...");
  }
  
  try {
    const token = await getToken({ req: request, secret });
    console.log("[TEST] getToken result:", !!token);
    console.log("[TEST] Token ID:", token?.id);
    console.log("[TEST] Token email:", token?.email);
    
    if (token) {
      return NextResponse.json({ 
        success: true, 
        message: "Authentication working",
        userId: token.id,
        email: token.email
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: "No token found",
        cookies: cookieNames
      }, { status: 401 });
    }
  } catch (error) {
    console.error("[TEST] getToken error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "getToken error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 