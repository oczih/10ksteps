import axios from 'axios';
import { User } from '@/types';
const API_URL = 'http://localhost:3000/api/users';

const get = async (id: string): Promise<User> => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}
const update = async (id: string, newData: Partial<User>): Promise<User> => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, newData);
        return response.data;

    }catch(error){
        console.error('Error updating user:', error);
        throw error;
    }
}

export default {
    update,
    get
}