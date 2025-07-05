import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongoose';
import WalkRoute from '@/app/models/walkroutemodel';
import WalkUser from '@/app/models/usermodel';
import { getToken } from '@auth/core/jwt';
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(request: Request) {
  await connectDB();
  
  const token = await getToken({ req: request, secret });
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  const walkingroutes = await WalkRoute.find();
  return NextResponse.json({ walkingroutes });
}

export async function POST(request: Request) {
  console.log("[API] POST /api/walkingroutes - Starting request");
  
  try {
    await connectDB();
    console.log("[API] Database connected successfully");
  } catch (error) {
    console.error("[API] Database connection failed:", error);
    return NextResponse.json({ message: "Database connection failed" }, { status: 500 });
  }
  
  console.log("[API] NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET);
  console.log("[API] NEXTAUTH_SECRET length:", process.env.NEXTAUTH_SECRET?.length);
  
  // Debug cookies - Request type doesn't have cookies property
  console.log("[API] Request headers:", Object.fromEntries(request.headers.entries()));
  
  const token = await getToken({ req: request, secret });
  console.log("[API] Token extracted:", !!token, "Token ID:", token?.id);
  console.log("[API] Full token object:", JSON.stringify(token, null, 2));
  
  if (!token) {
    console.log("[API] No token found - Unauthorized");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    console.log("📥 Incoming request body:", body);

    const {
      date,
      time,
      distance,
      calories,
      pace,
      steps,
      coordinates,
      routeName,
      routeDescription,
      madeFor
    } = body;

    // Validate individual fields if needed
    if (!coordinates || !Array.isArray(coordinates) || !coordinates.every(pair => Array.isArray(pair) && pair.length === 2)) {
      console.error("❌ Invalid coordinates format:", coordinates);
      return new NextResponse("Invalid coordinates", { status: 400 });
    }

    const newRoute = await WalkRoute.create({
      date: new Date(date),
      time,
      distance,
      calories,
      pace,
      steps,
      coordinates,
      routeName,
      routeDescription,
      madeFor
    });
    await WalkUser.findByIdAndUpdate(
      madeFor,
      { $push: { walkingroutes: newRoute._id } },
      { new: true }
  );
    console.log("✅ New route created:", newRoute);
    return NextResponse.json({ walkingroute: newRoute });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error in POST /api/walkingroutes:", error.message, error);
    } else {
      console.error("❌ Error in POST /api/walkingroutes:", error);
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}