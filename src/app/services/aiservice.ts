import axios from 'axios';

const API_URL = '/api/ai';

export const sendPrompt = async (prompt: string, messages: string[]): Promise<string> => {
  try {
    console.log('Sending prompt to Gemini:', prompt);
    const response = await axios.post(API_URL, { prompt, messages });
    console.log(response.data.text)
    return response.data.text;
  } catch (error: any) {
    console.error('❌ Error from Gemini service:', error);
    
    throw new Error(error.response?.data?.error || 'Failed to get response from AI');
  }
};