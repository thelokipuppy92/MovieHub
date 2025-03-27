import React, { useEffect, useState } from 'react';
import Movie from '../model/movie.model';
import { MovieService } from '../service/MovieService';
import Actor from '../model/actor.model';


interface ActorMovieModalProps {
    actor: Actor;
    onClose: () => void;
}

function ActorMovieModal({ actor, onClose }: ActorMovieModalProps) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchActorMovies();
    }, [actor]);

    const fetchActorMovies = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await MovieService.getMoviesByActorId(actor.id);
            setMovies(data);
        } catch (err) {
            setError('Failed to load movies.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Movies starring {actor.name}</h2>
                {loading && <p>Loading movies...</p>}
                {error && <p className="error-text">{error}</p>}
                {!loading && !error && (
                    <>
                        {movies.length > 0 ? (
                            <ul>
                                {movies.map((movie) => (
                                    <li key={movie.id}>
                                        <strong>{movie.title}</strong> ({movie.releaseYear})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No movies found for this actor.</p>
                        )}
                    </>
                )}
                <div className="modal-buttons">
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default ActorMovieModal;
