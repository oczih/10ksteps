import axios from 'axios';
import { User } from '@/types';

const API_URL = `/api/users`;

/**
 * Get a user by ID
 */
const get = async (id: string): Promise<{ user: User }> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
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
  newData: Partial<User>
): Promise<{ user: User }> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, newData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export default {
  get,
  update,
};
