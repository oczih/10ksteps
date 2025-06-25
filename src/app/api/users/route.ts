import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongoose';
import WalkUser from '@/app/models/usermodel';

export async function GET() {
  await connectDB();
  const users = await WalkUser.find();
  return NextResponse.json({ users });
}
