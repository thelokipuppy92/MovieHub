import Director from '../model/director.model';
import { DIRECTOR_ENDPOINT } from '../constants/api';

export class DirectorService {

    static async getDirectors(): Promise<Director[]> {
        const response = await fetch(DIRECTOR_ENDPOINT);
        if (!response.ok) {
            throw new Error('Failed to fetch directors');
        }
        return response.json();
    }

    static async addDirector(director: Omit<Director, 'id'>): Promise<Director> {
        const response = await fetch(DIRECTOR_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(director),
        });
        if (!response.ok) {
            throw new Error('Failed to add director');
        }
        return response.json();
    }

    static async updateDirector(director: Director): Promise<void> {
        const response = await fetch(`${DIRECTOR_ENDPOINT}/${director.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(director),
        });
        if (!response.ok) {
            throw new Error('Failed to update director');
        }
    }

    static async deleteDirector(id: string): Promise<void> {
        const response = await fetch(`${DIRECTOR_ENDPOINT}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete director');
        }
    }
}
