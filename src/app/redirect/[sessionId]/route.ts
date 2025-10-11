import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const sessionParam = params.sessionId; // Could be an ID or encoded URL
  const returnUrl = request.nextUrl.searchParams.get("return");

  if (!sessionParam) {
    return new NextResponse("Missing session parameter", { status: 400 });
  }
  if (!returnUrl) {
    return new NextResponse("Missing return URL", { status: 400 });
  }

  // Decode the session param in case it was URL-encoded
  let stripeUrl: string;
  try {
    const decoded = decodeURIComponent(sessionParam);
    stripeUrl = decoded.startsWith("http")
      ? decoded
      : `https://checkout.stripe.com/pay/${decoded}`;
  } catch {
    stripeUrl = `https://checkout.stripe.com/pay/${sessionParam}`;
  }

  // ✅ Redirect user to Stripe checkout
  return NextResponse.redirect(stripeUrl);
}
