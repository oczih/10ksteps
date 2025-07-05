import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth-client';

export async function GET() {
  console.log("[TEST] Testing NextAuth v5 auth() function...");
  
  try {
    const session = await auth();
    console.log("[TEST] auth() result:", !!session);
    console.log("[TEST] Session user ID:", session?.user?.id);
    console.log("[TEST] Session user email:", session?.user?.email);
    
    if (session) {
      return NextResponse.json({
        success: true,
        message: "NextAuth v5 auth() working",
        userId: session.user?.id,
        email: session.user?.email
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "No session found"
      }, { status: 401 });
    }
  } catch (error) {
    console.error("[TEST] auth() error:", error);
    return NextResponse.json({
      success: false,
      message: "auth() error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 