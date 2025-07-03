import axios from 'axios';

const API_URL = '/api/ai';


export const sendPrompt = async (prompt: string, messages: string[]): Promise<string> => {
  try {
    const response = await axios.post(API_URL, { prompt, messages });
    return response.data.text;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Error from Gemini service:', error);
      throw new Error(error.response?.data?.error || 'Failed to get response from AI');
    } else {
      console.error('❌ Unexpected error from Gemini service:', error);
      throw new Error('Failed to get response from AI');
    }
  }
};
