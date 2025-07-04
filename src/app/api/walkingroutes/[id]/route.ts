import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongoose';
import WalkRoute from '@/app/models/walkroutemodel';
const AUTH_HEADER = 'authorization';
const EXPECTED_TOKEN = process.env.PRIVATE_API_TOKEN; // Set this in Vercel

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get(AUTH_HEADER);
  return authHeader === `Bearer ${EXPECTED_TOKEN}`;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    await connectDB();
    const { id } = await params;
  
    try {
      const user = await WalkRoute.findById(id).populate('user');
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ user });
    } catch (error) {
      console.error('Error fetching walking route:', error);
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
  }


  export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    await connectDB();
    const { id } = await params;
  
    try {
      const body = await request.json();
      const {
        steps, date, time, distance, calories, pace, routing, routeName, routeDescription
      } = body;
  
      const route = await WalkRoute.findByIdAndUpdate(
        id,
        {
            steps, date, time, distance, calories, pace, routing, routeName, routeDescription
        },
        { new: true }
      );
  
      if (!route) {
        return NextResponse.json({ error: 'Walking route not found' }, { status: 404 });
      }
  
      return NextResponse.json({ route });
    } catch (error) {
      console.error('Error updating walking route:', error);
      return NextResponse.json({ error: 'Failed to update route' }, { status: 500 });
    }
  }

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    await connectDB();
    const { id } = await params;
    try{
        const route = await WalkRoute.findByIdAndDelete(id);
        if(!route){
            return NextResponse.json({ error: 'Route not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Route deleted successfully' });
    }catch(error){
        console.error('Error deleting walking route:', error);
        return NextResponse.json({ error: 'Failed to delete route' }, { status: 500 });
    }
}
