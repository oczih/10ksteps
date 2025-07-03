import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongoose';
import WalkUser from '@/app/models/usermodel';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import WalkRoute from '@/app/models/walkroutemodel';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id } = await params;
    if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Valid MongoDB ObjectId is required' }, { status: 400 });
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
  
    try {
      const body = await request.json();
      const {
        name, username, password, email, walkingroutes,
        weight, height, age, gender, activityLevel, goal, goalWeight
      } = body;
  
      const user = await WalkUser.findById(id);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      // Check if trying to change the username
      if (username && username !== user.username) {
        const lastChange = user.lastUsernameChange || new Date(0);
        const now = new Date();
        const diffMs = now.getTime() - lastChange.getTime();
        const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  
        if (diffMs < SEVEN_DAYS) {
          return NextResponse.json({
            error: 'Username can only be changed once every 7 days.',
          }, { status: 403 });
        }
  
        user.username = username;
        user.lastUsernameChange = now;
      }
  
      // Update the rest of the fields
      if (name !== undefined) user.name = name;
      if (password !== undefined) user.password = password;
      if (email !== undefined) user.email = email;
      if (walkingroutes !== undefined) user.walkingroutes = walkingroutes;
      if (weight !== undefined) user.weight = weight;
      if (height !== undefined) user.height = height;
      if (age !== undefined) user.age = age;
      if (gender !== undefined) user.gender = gender;
      if (activityLevel !== undefined) user.activityLevel = activityLevel;
      if (goal !== undefined) user.goal = goal;
      if (goalWeight !== undefined) user.goalWeight = goalWeight;
  
      await user.save();
  
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