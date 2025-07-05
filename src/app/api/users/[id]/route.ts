import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongoose';
import WalkUser from '@/app/models/usermodel';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import WalkRoute from '@/app/models/walkroutemodel';
import mongoose from 'mongoose';
import { getToken } from '@auth/core/jwt';
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  console.log("[API] GET /api/users/[id] - Starting request");
  
  try {
    await connectDB();
    console.log("[API] Database connected successfully");
  } catch (error) {
    console.error("[API] Database connection failed:", error);
    return NextResponse.json({ message: "Database connection failed" }, { status: 500 });
  }
  
  console.log("[API] NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET);
  console.log("[API] NEXTAUTH_SECRET length:", process.env.NEXTAUTH_SECRET?.length);
  console.log("[API] NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
  console.log("[API] Request URL:", request.url);
  
  // Debug cookies
  const cookies = request.cookies;
  const cookieNames = Array.from(cookies.getAll()).map(cookie => cookie.name);
  console.log("[API] Available cookies:", cookieNames);
  console.log("[API] Session token cookie:", cookies.get("__Secure-next-auth.session-token")?.value?.substring(0, 50) + "...");
  console.log("[API] Regular session token cookie:", cookies.get("next-auth.session-token")?.value?.substring(0, 50) + "...");
  
  // Try to get token using getToken
  const token = await getToken({ req: request, secret });
  console.log("[API] Token extracted:", !!token, "Token ID:", token?.id);
  console.log("[API] Full token object:", JSON.stringify(token, null, 2));
  
  // If getToken fails, try manual extraction
  if (!token) {
    console.log("[API] getToken failed, trying manual extraction...");
    const sessionToken = cookies.get("__Secure-next-auth.session-token")?.value || 
                        cookies.get("next-auth.session-token")?.value;
    console.log("[API] Manual session token found:", !!sessionToken);
  }

  if (!token) {
    console.log("[API] No token found - Unauthorized");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  console.log("[API] Requested user ID:", id);

  console.log("[API] Token id:", token?.id, "Requested ID:", id);
  if (token?.id !== id) {
    console.log("[API] Token mismatch - Forbidden");
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Valid MongoDB ObjectId is required' }, { status: 400 });
  }

  try {
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
    const token = await getToken({ req: request, secret });
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    if (token.id !== id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
  
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
    const token = await getToken({ req: request, secret });
    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    if (token.id !== id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    await connectDB();
  
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