import Actor from '../model/actor.model';
import { ACTOR_ENDPOINT } from '../constants/api';

export class ActorService {
    static async getActors(): Promise<Actor[]> {
        const response = await fetch(ACTOR_ENDPOINT);
        if (!response.ok) {
            throw new Error('Failed to fetch actors');
        }
        return response.json();
    }

    static async addActor(actor: Omit<Actor, 'id'>): Promise<Actor> {
        const response = await fetch(ACTOR_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(actor),
        });
        if (!response.ok) {
            throw new Error('Failed to add actor');
        }
        return response.json();
    }

    static async updateActor(actor: Actor): Promise<void> {
        const response = await fetch(`${ACTOR_ENDPOINT}/${actor.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(actor),
        });
        if (!response.ok) {
            throw new Error('Failed to update actor');
        }
    }

    static async deleteActor(id: string): Promise<void> {
        const response = await fetch(`${ACTOR_ENDPOINT}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete actor');
        }
    }
}
