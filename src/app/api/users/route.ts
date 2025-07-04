import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
// import WalkRoute from '@/app/models/walkroutemodel';
import WalkUser from '@/app/models/usermodel';

const AUTH_HEADER = 'authorization';
const EXPECTED_TOKEN = process.env.PRIVATE_API_TOKEN; // Set this in Vercel

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get(AUTH_HEADER);
  return authHeader === `Bearer ${EXPECTED_TOKEN}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

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
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

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
