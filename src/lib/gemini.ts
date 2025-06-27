import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export async function getGeminiResponse(prompt: string, messages: string[]) {
    const promptWithInstructions = `You are an expert in knowing the best walking routes around the worlds cities. 
    Only answer questions related to walking routes and places along the way.\n
    Here are the previous questions messages from the the chat: ${messages.join('\n')}\n. When offering a route give it in the following format:
    Give a number of pins in a city in the coordinates format: lat,long. I.e.: [24.941512, 60.173241], make the route reasonable and according
    to the route the user has asked for. Question: ${prompt}`;
  
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptWithInstructions,
    });
    return response.text;
  }
