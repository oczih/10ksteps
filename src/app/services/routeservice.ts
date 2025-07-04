import axios from 'axios';
import { WalkRouteEntry, WalkRoute } from '@/types';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/walkingroutes`;
const API_URL_USER = `${process.env.NEXT_PUBLIC_API_URL}/api/users`;
import { getSession } from "next-auth/react";

export const create = async (routeData: WalkRouteEntry): Promise<WalkRoute> => {
  try {
    const session = await getSession();
    const token = session?.accessToken; // adjust if your token key differs

    const response = await axios.post(API_URL, routeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.walkingroute;
  } catch (error) {
    console.error('Error creating route:', error);
    throw error;
  }
};

export const getUserRoutes = async (user: { _id?: string; id?: string }): Promise<WalkRoute[]> => {
  try {
    const userId = user?._id || user?.id;
    if (!userId) {
      throw new Error("User ID is required to fetch routes.");
    }

    const session = await getSession();
    const token = session?.accessToken;

    const response = await axios.get(`${API_URL_USER}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.user.walkingroutes;
  } catch (error) {
    console.error('Error fetching routes:', error);
    throw error;
  }
};


