import { NextResponse } from 'next/server';
import { getGeminiResponse } from '@/lib/gemini';
import { auth } from '@/lib/auth-client';
export async function POST(req: Request) {
  const session = await auth();
  if(!session){
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