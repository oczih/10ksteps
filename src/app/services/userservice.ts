import axios from 'axios';
import { User } from '@/types';
const API_URL = 'http://localhost:3000/api/users';
let token: string | null = null

const setToken = (newToken: string) => {
  token = `Bearer ${newToken}`
}

const get = async (id: string): Promise<{ user: User }> => {
    const config = {
        headers: {
            Authorization: token
        }
    }
    try {
        const response = await axios.get(`${API_URL}/${id}`, config);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}
const update = async (id: string, newData: Partial<User>): Promise<{ user: User }> => {
    const config = {
        headers: {
            Authorization: token
        }
    }
    try {
        console.log('Updating user:', id, newData);
        const response = await axios.put(`${API_URL}/${id}`, newData, config);
        return response.data;

    }catch(error){
        console.error('Error updating user:', error);
        throw error;
    }
}

export default {
    update,
    get,
    setToken
}