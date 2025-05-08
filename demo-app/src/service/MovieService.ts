import axios from 'axios';
import Movie from '../model/movie.model';
import { MOVIE_ENDPOINT } from '../constants/api';

export class MovieService {
    static async getMovies1({ search = '', genre = '', sortBy = '', sortOrder = 'asc' }: {
        search: string;
        genre: string;
        sortBy: string;
        sortOrder: string;
    }): Promise<Movie[]> {
        const params = { search, genre, sortBy, sortOrder };
        const response = await axios.get(`${MOVIE_ENDPOINT}/fil`, { params });
        return response.data;
    }

    static async getMovies(): Promise<Movie[]> {
        const response = await axios.get(MOVIE_ENDPOINT);
        return response.data;
    }

    static async addMovie(movie: { title: string; releaseYear: number; genre: string; directorId: string }): Promise<Movie> {
        const response = await axios.post(`${MOVIE_ENDPOINT}/add`, movie);
        return response.data;
    }

    static async updateMovie(id: string, movie: { title: string; releaseYear: number; genre: string; directorId: string }): Promise<void> {
        await axios.put(`${MOVIE_ENDPOINT}/${id}`, movie);
    }

    static async deleteMovie(id: string): Promise<void> {
        await axios.delete(`${MOVIE_ENDPOINT}/${id}`);
    }

    static async getMoviesByGenre(genre: string): Promise<Movie[]> {
        const response = await axios.get(`${MOVIE_ENDPOINT}/genre/${genre}`);
        return response.data;
    }

    static async getMoviesByDirector(directorId: string): Promise<Movie[]> {
        const response = await axios.get(`${MOVIE_ENDPOINT}/director/${directorId}`);
        return response.data;
    }

    static async getMoviesByActorId(actorId: string): Promise<Movie[]> {
        const response = await axios.get(`${MOVIE_ENDPOINT}/actor/${actorId}`);
        return response.data;
    }

    static async assignActorsToMovie(movieId: string, actorIds: string[]): Promise<void> {
        await axios.post(`${MOVIE_ENDPOINT}/${movieId}/actors`, actorIds);
    }

    static async getAvailableGenres(): Promise<string[]> {
        const response = await axios.get(`${MOVIE_ENDPOINT}/available-genres`);
        return response.data;
    }
}
