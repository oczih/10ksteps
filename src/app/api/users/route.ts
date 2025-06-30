import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
// Import WalkRoute first to ensure it's registered
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import WalkRoute from '@/app/models/walkroutemodel';
import WalkUser from '@/app/models/usermodel';

export async function GET() {
  await connectDB();

  try {
    const users = await WalkUser.find({}).populate('walkingroutes');
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connectDB();

  try {
    const body = await request.json();
    const user = new WalkUser(body);
    const savedUser = await user.save();
    return NextResponse.json({ user: savedUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
