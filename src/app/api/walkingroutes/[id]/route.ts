import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongoose';
import WalkRoute from '@/app/models/walkroutemodel';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();
    const { id } = params;
  
    try {
      const user = await WalkRoute.findById(id);
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
      return NextResponse.json({ error: 'Failed to update route' }, { status: 500 });
    }
  }

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();
    const { id } = params;
    try{
        const route = await WalkRoute.findByIdAndDelete(id);
        if(!route){
            return NextResponse.json({ error: 'Route not found' }, { status: 404 });
        }
    }catch(error){
        return NextResponse.json({ error: 'Failed to delete route' }, { status: 500 });
    }
}