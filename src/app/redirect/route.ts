import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const returnUrl = req.nextUrl.searchParams.get("return");

  if (!returnUrl) {
    return new NextResponse("Missing return URL", { status: 400 });
  }

  // Optionally log or handle the status here
  return NextResponse.redirect(`${returnUrl}?payment=${status}`);
}