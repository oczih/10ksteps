import axios from 'axios';
import { User } from '@/types';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/users`;

/**
 * Get a user by ID, passing access token from client
 */
const get = async (id: string, accessToken?: string): Promise<{ user: User }> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken || ''}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Update a user by ID
 */
const update = async (
  id: string,
  newData: Partial<User>,
  accessToken?: string
): Promise<{ user: User }> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, newData, {
      headers: {
        Authorization: `Bearer ${accessToken || ''}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

const userservice = {
  get,
  update,
};

export default userservice;
