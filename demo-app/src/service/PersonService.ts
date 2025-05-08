import axios from 'axios';
import Person from '../model/person.model';
import { PERSON_ENDPOINT } from '../constants/api';

export class PersonService {
    static async getPersons(): Promise<Person[]> {
        const response = await axios.get(PERSON_ENDPOINT);
        return response.data;
    }

    static async addPerson(person: Omit<Person, 'id'>): Promise<Person> {
        const response = await axios.post(PERSON_ENDPOINT, person);
        return response.data;
    }

    static async updatePerson(person: Person): Promise<void> {
        await axios.put(`${PERSON_ENDPOINT}/${person.id}`, person);
    }

    static async deletePerson(id: string): Promise<void> {
        await axios.delete(`${PERSON_ENDPOINT}/${id}`);
    }

    static async getPersonById(personId: string): Promise<Person | null> {
        try {
            const response = await axios.get(`${PERSON_ENDPOINT}/${personId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }
}
