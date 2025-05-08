import axios from 'axios';
import Actor from '../model/actor.model';
import { ACTOR_ENDPOINT } from '../constants/api';

export class ActorService {
    static async getActors(): Promise<Actor[]> {
        const response = await axios.get(ACTOR_ENDPOINT);
        return response.data;
    }

    static async addActor(actor: Omit<Actor, 'id'>): Promise<Actor> {
        const response = await axios.post(ACTOR_ENDPOINT, actor);
        return response.data;
    }

    static async updateActor(actor: Actor): Promise<void> {
        await axios.put(`${ACTOR_ENDPOINT}/${actor.id}`, actor);
    }

    static async deleteActor(id: string): Promise<void> {
        await axios.delete(`${ACTOR_ENDPOINT}/${id}`);
    }
}
