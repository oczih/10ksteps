import { NextResponse } from 'next/server';
import { getGeminiResponse } from '@/lib/gemini';

export async function POST(req: Request) {
  const { prompt, messages } = await req.json();

  try {
    const result = await getGeminiResponse(prompt, messages);
    return NextResponse.json({ text: result });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}