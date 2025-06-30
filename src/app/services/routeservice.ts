import axios from 'axios';
import { WalkRouteEntry, WalkRoute } from '@/types';

const API_URL = 'http://localhost:3000/api/walkingroutes';

const create = async (routeData: WalkRouteEntry): Promise<WalkRoute> => {
  try {
    const response = await axios.post(API_URL, routeData);
    return response.data.walkingroute;
  } catch (error) {
    console.error('Error creating route:', error);
    throw error;
  }
};

const getUserRoutes = async (user: { _id?: string; id?: string }): Promise<WalkRoute[]> => {
  try {
    // Handle both session user (with id) and full user object (with _id)
    const userId = user?._id || user?.id;
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data.walkingroutes;
  } catch (error) {
    console.error('Error fetching routes:', error);
    throw error;
  }
};

export default {
  create,
  getUserRoutes
};
