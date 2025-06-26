import axios from 'axios';
import { WalkRouteEntry } from '@/types';

const API_URL = 'http://localhost:3000/api/walkingroutes';

const create = async (routeData: WalkRouteEntry): Promise<WalkRouteEntry> => {
    try {
        const response = await axios.post(API_URL, routeData);
        return response.data;
    }catch(error){
        console.error('Error creating route:', error);
        throw error;
    }
}

export default {
    create
}