import axios from 'axios';

const API_URL = '/api/ai';
let token: string | null = null

const setToken = (newToken: string) => {
  token = `Bearer ${newToken}`
}

export const sendPrompt = async (prompt: string, messages: string[]): Promise<string> => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  try {
    console.log('Sending prompt to Gemini:', prompt);
    const response = await axios.post(API_URL, { prompt, messages }, config);
    console.log(response.data.text)
    return response.data.text;
  } catch (error: any) {
    console.error('❌ Error from Gemini service:', error);
    
    throw new Error(error.response?.data?.error || 'Failed to get response from AI');
  }
};

export default {
  setToken
}