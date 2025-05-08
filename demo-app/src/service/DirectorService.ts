import axios from 'axios';
import Director from '../model/director.model';
import { DIRECTOR_ENDPOINT } from '../constants/api';

export class DirectorService {
    static async getDirectors(): Promise<Director[]> {
        const response = await axios.get(DIRECTOR_ENDPOINT);
        return response.data;
    }

    static async addDirector(director: Omit<Director, 'id'>): Promise<Director> {
        const response = await axios.post(DIRECTOR_ENDPOINT, director);
        return response.data;
    }

    static async updateDirector(director: Director): Promise<void> {
        await axios.put(`${DIRECTOR_ENDPOINT}/${director.id}`, director);
    }

    static async deleteDirector(id: string): Promise<void> {
        await axios.delete(`${DIRECTOR_ENDPOINT}/${id}`);
    }
}


