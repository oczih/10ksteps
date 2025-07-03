import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongoose';
import WalkUser from '@/app/models/usermodel';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id } = await params;
    try {
        const user = await WalkUser.findById(id).populate('walkingroutes');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(user.walkingroutes);
    } catch (error) {
        console.error('Error fetching walking routes:', error);
        return NextResponse.json({ error: 'Failed to fetch walking routes' }, { status: 500 });
    }
}