import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_TEST!, {
  apiVersion: "2025-09-30.clover",
});

interface Params {
  sessionId: string;
}
// 🟢 POST: Add a new promotion
export async function GET(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { sessionId } = await context.params;
  const returnUrl = req.nextUrl.searchParams.get("return");
  console.log("Redirecting via cloak:", sessionId);
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
