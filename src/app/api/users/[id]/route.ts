import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongoose';
import WalkUser from '@/app/models/usermodel';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();
    const { id } = params;
  
    try {
      const user = await WalkUser.findById(id);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ user });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
  }
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();
    const { id } = params;
  
    try {
      const body = await request.json();
      const {
        name, username, password, email, walkingroutes,
        weight, height, age, gender, activityLevel, goal, goalWeight
      } = body;
  
      const user = await WalkUser.findByIdAndUpdate(
        id,
        {
          name, username, password, email, walkingroutes,
          weight, height, age, gender, activityLevel, goal, goalWeight
        },
        { new: true }
      );
  
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      return NextResponse.json({ user });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
  }

  export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();
    const { id } = params;
  
    try {
      const user = await WalkUser.findByIdAndDelete(id);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
  }