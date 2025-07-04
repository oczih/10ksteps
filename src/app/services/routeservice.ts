// routeservice.ts
import axios from 'axios';
import { WalkRouteEntry, WalkRoute } from '@/types';

const API_URL = `/api/walkingroutes`;
const API_URL_USER = `/api/users`;

export const create = async (
  routeData: WalkRouteEntry
): Promise<WalkRoute> => {
  try {
    const response = await axios.post(API_URL, routeData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data.walkingroute;
  } catch (error) {
    console.error('Error creating route:', error);
    throw error;
  }
};

export const getUserRoutes = async (
  user: { _id?: string; id?: string }
): Promise<WalkRoute[]> => {
  try {
    const userId = user?._id || user?.id;
    if (!userId) throw new Error("User ID is required to fetch routes.");

    const response = await axios.get(`${API_URL_USER}/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data.user.walkingroutes;
  } catch (error) {
    console.error('Error fetching user routes:', error);
    throw error;
  }
};
