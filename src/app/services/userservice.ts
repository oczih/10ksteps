import axios from 'axios';
import { User } from '@/types';
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/users`;
import { getSession } from "next-auth/react";

const get = async (id: string): Promise<{ user: User }> => {
  try {
    const session = await getSession();
    const token = session?.accessToken; // or session?.token depending on your setup

    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

const update = async (id: string, newData: Partial<User>): Promise<{ user: User }> => {
  try {
    const session = await getSession();
    const token = session?.accessToken;

    const response = await axios.put(`${API_URL}/${id}`, newData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    update,
    get,
}