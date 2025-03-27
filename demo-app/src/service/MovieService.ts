import Movie from '../model/movie.model';
import { MOVIE_ENDPOINT } from '../constants/api';

export class MovieService {

    static async getMovies(): Promise<Movie[]> {
        const response = await fetch(MOVIE_ENDPOINT);
        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }
        return response.json();
    }

    static async addMovie(movie: { title: string; releaseYear: number; genre: string; directorId: string }): Promise<Movie> {
        const response = await fetch(`${MOVIE_ENDPOINT}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movie),
        });

        if (!response.ok) {
            throw new Error('Failed to add movie');
        }

        return response.json();
    }

    static async updateMovie(id: string, movie: { title: string; releaseYear: number; genre: string; directorId: string }): Promise<void> {
        const response = await fetch(`${MOVIE_ENDPOINT}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movie),
        });

        if (!response.ok) {
            throw new Error('Failed to update movie');
        }
    }

    static async deleteMovie(id: string): Promise<void> {
        const response = await fetch(`${MOVIE_ENDPOINT}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete movie');
        }
    }

    static async getMoviesByGenre(genre: string): Promise<Movie[]> {
        const response = await fetch(`${MOVIE_ENDPOINT}/genre/${genre}`);
        if (!response.ok) {
            throw new Error('Failed to fetch movies by genre');
        }
        return response.json();
    }

    static async getMoviesByDirector(directorId: string): Promise<Movie[]> {
        const response = await fetch(`${MOVIE_ENDPOINT}/director/${directorId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch movies by director');
        }
        return response.json();
    }

    static async getMoviesByActorId(actorId: string): Promise<Movie[]> {
        try {
            const response = await fetch(`${MOVIE_ENDPOINT}/actor/${actorId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch movies by actor ID');
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching movies by actor ID:', error);
            throw error;
        }
    }

    static async assignActorsToMovie(movieId: string, actorIds: string[]): Promise<void> {
        const response = await fetch(`${MOVIE_ENDPOINT}/${movieId}/actors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(actorIds),
        });

        if (!response.ok) {
            throw new Error('Failed to assign actors to movie');
        }
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    }



}
