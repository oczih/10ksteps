import { NextResponse } from 'next/server';
import { getGeminiResponse } from '@/lib/gemini';
import { getToken } from '@auth/core/jwt';
const secret = process.env.NEXTAUTH_SECRET;
export async function POST(req: Request) {
  const token = await getToken({ req: req, secret });
  if(!token){
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { prompt, messages } = await req.json();

  try {
    const result = await getGeminiResponse(prompt, messages);
    return NextResponse.json({ text: result });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}