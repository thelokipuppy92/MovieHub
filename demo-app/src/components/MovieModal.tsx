import React, { useState, useEffect } from 'react';
import Movie from "../model/movie.model";
import { DirectorService } from "../service/DirectorService";

interface MovieModalProps {
    isOpen: boolean;
    isUpdateMode: boolean;
    initialMovie: Movie;
    onClose: () => void;
    onAdd: (movie: Movie) => Promise<void>;
    onUpdate: (movie: Movie) => Promise<void>;
}

function MovieModal({ isOpen, isUpdateMode, initialMovie, onClose, onAdd, onUpdate }: MovieModalProps) {
    const [movie, setMovie] = useState<Movie>(initialMovie);
    const [directors, setDirectors] = useState<{ id?: string; name: string; email?: string; age?: number }[]>([]);

    useEffect(() => {
        setMovie(initialMovie);
    }, [initialMovie]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const directorsData = await DirectorService.getDirectors();
                setDirectors(directorsData);
            } catch (error) {
                console.error("Error fetching directors:", error);
            }
        };

        if (isOpen) {
            fetchData();
        }

        const handleDirectorsUpdated = () => {
            if (isOpen) {
                fetchData();
            }
        };

        window.addEventListener('directorListUpdated', handleDirectorsUpdated);

        return () => {
            window.removeEventListener('directorListUpdated', handleDirectorsUpdated);
        };
    }, [isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMovie({
            ...movie,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        if (isUpdateMode) {
            await onUpdate(movie);
        } else {
            await onAdd(movie);
        }

        const updateEvent = new Event('movieListUpdated');
        window.dispatchEvent(updateEvent);

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{isUpdateMode ? 'Update Movie' : 'Add Movie'}</h2>
                {isUpdateMode && (
                    <input
                        type="text"
                        name="id"
                        placeholder="ID"
                        value={movie.id}
                        disabled
                    />
                )}
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={movie.title}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="releaseYear"
                    placeholder="Release Year"
                    value={movie.releaseYear || ''}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="genre"
                    placeholder="Genre"
                    value={movie.genre}
                    onChange={handleInputChange}
                />

                {/* Director Dropdown */}
                <label>Director:</label>
                <select name="directorId" value={movie.directorId} onChange={handleInputChange}>
                    <option value="">Select Director</option>
                    {directors.map((director) => (
                        <option key={director.id} value={director.id}>
                            {director.name}
                        </option>
                    ))}
                </select>

                <div className="modal-buttons">
                    <button onClick={handleSubmit}>
                        {isUpdateMode ? 'Update' : 'Add'}
                    </button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default MovieModal;
