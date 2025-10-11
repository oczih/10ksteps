import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const returnUrl = req.nextUrl.searchParams.get("return");
  if (!status) {
    return new NextResponse("No status", { status: 400 });
  }
  if (!returnUrl) {
    return new NextResponse("Missing return URL", { status: 400 });
  }

  // Forward user back to the original site (e.g., Fanslio)
  return NextResponse.redirect(returnUrl);
}
