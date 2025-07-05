import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@auth/core/jwt';
import { jwtVerify } from 'jose';

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(request: NextRequest) {
  console.log("[DEBUG] Debug token endpoint called");
  
  // Check environment variables
  console.log("[DEBUG] NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET);
  console.log("[DEBUG] NEXTAUTH_SECRET length:", process.env.NEXTAUTH_SECRET?.length);
  console.log("[DEBUG] NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
  
  // Get cookies
  const cookies = request.cookies;
  const sessionToken = cookies.get("__Secure-next-auth.session-token")?.value || 
                      cookies.get("next-auth.session-token")?.value;
  
  console.log("[DEBUG] Session token found:", !!sessionToken);
  
  if (!sessionToken) {
    return NextResponse.json({ 
      error: "No session token found",
      cookies: Array.from(cookies.getAll()).map(c => c.name)
    });
  }
  
  // Try getToken first
  console.log("[DEBUG] Trying getToken...");
  try {
    const token = await getToken({ req: request, secret });
    console.log("[DEBUG] getToken result:", !!token);
    console.log("[DEBUG] getToken user ID:", token?.id);
    
    if (token) {
      return NextResponse.json({
        method: "getToken",
        success: true,
        userId: token.id,
        email: token.email
      });
    }
  } catch (error) {
    console.error("[DEBUG] getToken error:", error);
  }
  
  // Try manual JWT verification
  console.log("[DEBUG] Trying manual JWT verification...");
  try {
    const secretBuffer = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(sessionToken, secretBuffer);
    
    console.log("[DEBUG] Manual JWT verification successful");
    console.log("[DEBUG] JWT payload:", payload);
    
    return NextResponse.json({
      method: "manual",
      success: true,
      payload: payload
    });
  } catch (error) {
    console.error("[DEBUG] Manual JWT verification failed:", error);
    return NextResponse.json({
      method: "manual",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 