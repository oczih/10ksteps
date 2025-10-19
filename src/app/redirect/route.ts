import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const stripeUrl = req.nextUrl.searchParams.get("to");
  const returnUrl = req.nextUrl.searchParams.get("return");
  const status = req.nextUrl.searchParams.get("status");

  // If coming back from Stripe (success/cancel)
  if (status && returnUrl) {
    return NextResponse.redirect(`${returnUrl}?payment=${status}`);
  }

  if (!stripeUrl) {
    return new NextResponse("Missing Stripe URL", { status: 400 });
  }

  // Decode once
  let decoded = decodeURIComponent(stripeUrl);

  // If still wrapped in 10ksteps redirect, unwrap it
  if (decoded.startsWith("https://10ksteps.vercel.app/redirect?to=")) {
    const urlParams = new URLSearchParams(decoded.split("?")[1]);
    const innerTo = urlParams.get("to");
    if (!innerTo) return new NextResponse("Invalid nested URL", { status: 400 });
    decoded = decodeURIComponent(innerTo);
  }

  // Final validation: must be a Stripe checkout URL
  if (!decoded.startsWith("https://checkout.stripe.com") && !decoded.startsWith("https://billing.stripe.com")) {
    return new NextResponse("Invalid redirect target", { status: 400 });
  }

  return NextResponse.redirect(decoded);
}
