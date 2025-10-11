import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { sessionId: string } }) {
  const { sessionId } = params;
  const returnUrl = req.nextUrl.searchParams.get("return");
  if (!returnUrl) {
    return new NextResponse("Missing return url", { status: 400 });
  }
  if (!sessionId) {
    return new NextResponse("Missing session ID", { status: 400 });
  }

  // Construct Stripe Checkout link
  const stripeUrl = `https://checkout.stripe.com/pay/${sessionId}`;

  // Save return URL (optional if you want to track)
  // You can store it in a DB or encode it in the redirect URL if needed

  // Redirect to Stripe checkout
  return NextResponse.redirect(stripeUrl);
}
