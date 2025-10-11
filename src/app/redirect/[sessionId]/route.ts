import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function GET(req: NextRequest, { params }: { params: { sessionId: string } }) {
  const { sessionId } = params;
  const returnUrl = req.nextUrl.searchParams.get("return");

  if (!sessionId) return new NextResponse("Missing session ID", { status: 400 });
  if (!returnUrl) return new NextResponse("Missing return URL", { status: 400 });

  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Redirect to Stripe checkout
    return NextResponse.redirect(session.url!);
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
