import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongoose';
import WalkRoute from '@/app/models/walkroutemodel';
import WalkUser from '@/app/models/usermodel';

export async function GET() {
  await connectDB();
  const walkingroutes = await WalkRoute.find();
  return NextResponse.json({ walkingroutes });
}

export async function POST(request: Request) {
  try {
    await connectDB();
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

  } catch (error: any) {
    console.error("❌ Error in POST /api/walkingroutes:", error.message, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}