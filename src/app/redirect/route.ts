import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const stripeUrl = req.nextUrl.searchParams.get("to");
  const returnUrl = req.nextUrl.searchParams.get("return");
  const status = req.nextUrl.searchParams.get("status");

  // If coming back from Stripe (success/cancel)
  if (status && returnUrl) {
    return NextResponse.redirect(`${returnUrl}?payment=${status}`);
  }

  // Otherwise, redirect to Stripe checkout
  if (!stripeUrl) {
    return new NextResponse("Missing Stripe URL", { status: 400 });
  }

  // Decode and validate
  const decoded = decodeURIComponent(stripeUrl);
  if (!decoded.startsWith("https://checkout.stripe.com")) {
    return new NextResponse("Invalid redirect target", { status: 400 });
  }

  return NextResponse.redirect(decoded);
}
