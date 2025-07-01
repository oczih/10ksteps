import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongoose';
import WalkUser from '@/app/models/usermodel';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import WalkRoute from '@/app/models/walkroutemodel';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id } = await params;
    if (!id || id === "undefined") {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    console.log("ID:", id);
  
    try {
      console.log("Fetching user:", id);
      const user = await WalkUser.findById(id).populate('walkingroutes');
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ user });
    } catch (error) {
      console.error('Error fetching user:', error);
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
  }
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id } = await params;
    console.log("Updating user:", id);
    console.log("Body:", request.body);
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
      console.error('Error updating user:', error);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
  }

  export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id } = await params;
  
    try {
      const user = await WalkUser.findByIdAndDelete(id);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
  }