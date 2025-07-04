import axios from 'axios';

export const sendPrompt = async (prompt: string, messages: string[]): Promise<string> => {
  try {
    const response = await axios.post('/api/ai', { prompt, messages });
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