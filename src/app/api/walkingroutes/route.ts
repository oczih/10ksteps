import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongoose';
import WalkRoute from '@/app/models/walkroutemodel';

export async function GET() {
  await connectDB();
  const walkingroutes = await WalkRoute.find();
  return NextResponse.json({ walkingroutes });
}
