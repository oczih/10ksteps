import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import WalkUser from '@/app/models/usermodel';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  await connectDB();
  const { id } = context.params;

  try {
    const user = await WalkUser.findById(id).populate('walkingroutes');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
