import React, { useState, useEffect } from "react";
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

function MovieModal({
                        isOpen,
                        isUpdateMode,
                        initialMovie,
                        onClose,
                        onAdd,
                        onUpdate,
                    }: MovieModalProps) {
    const [movie, setMovie] = useState<Movie>({
        ...initialMovie,
        released: initialMovie.released ?? false,
    });
    const [directors, setDirectors] = useState<
        { id?: string; name: string; email?: string; age?: number }[]
    >([]);
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMovie(initialMovie);
    }, [initialMovie]);

    useEffect(() => {
        const fetchDirectors = async () => {
            try {
                const directorsData = await DirectorService.getDirectors();
                setDirectors(directorsData);
            } catch (error) {
                console.error("Error fetching directors:", error);
            }
        };

        const fetchImages = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const headers: HeadersInit = {};
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                } else {
                    console.warn("No token found in localStorage");
                }

                const res = await fetch("http://localhost:8080/api/images", { headers });
                if (res.ok) {
                    const data = await res.json();
                    setImages(data);
                } else {
                    console.error("Failed to fetch images, status:", res.status);
                }
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        if (isOpen) {
            fetchDirectors();
            fetchImages();
        }

        const handleDirectorsUpdated = () => {
            if (isOpen) {
                fetchDirectors();
            }
        };

        window.addEventListener("directorListUpdated", handleDirectorsUpdated);
        return () => {
            window.removeEventListener("directorListUpdated", handleDirectorsUpdated);
        };
    }, [isOpen]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setMovie({ ...movie, [name]: value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setMovie({ ...movie, released: checked });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (isUpdateMode) {
                await onUpdate(movie);
            } else {
                await onAdd(movie);
            }

            const updateEvent = new Event("movieListUpdated");
            window.dispatchEvent(updateEvent);
            onClose();
        } catch (error) {
            console.error("Error during movie submission:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{isUpdateMode ? "Update Movie" : "Add Movie"}</h2>
                {loading && <p style={{ color: "blue", textAlign: "center" }}>Processing, please wait...</p>}

                {isUpdateMode && (
                    <input type="text" name="id" placeholder="ID" value={movie.id} disabled />
                )}
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={movie.title}
                    onChange={handleInputChange}
                    disabled={loading}
                />
                <input
                    type="number"
                    name="releaseYear"
                    placeholder="Release Year"
                    value={movie.releaseYear || ""}
                    onChange={handleInputChange}
                    disabled={loading}
                />
                <input
                    type="text"
                    name="genre"
                    placeholder="Genre"
                    value={movie.genre}
                    onChange={handleInputChange}
                    disabled={loading}
                />

                <label>Director:</label>
                <select
                    name="directorId"
                    value={movie.directorId}
                    onChange={handleInputChange}
                    disabled={loading}
                >
                    <option value="">Select Director</option>
                    {directors.map((director) => (
                        <option key={director.id} value={director.id}>
                            {director.name}
                        </option>
                    ))}
                </select>

                <label>Image:</label>
                <select
                    name="imageUrl"
                    value={movie.imageUrl || ""}
                    onChange={handleInputChange}
                    disabled={loading}
                >
                    <option value="">Select Image</option>
                    {images.map((imgPath) => (
                        <option key={imgPath} value={`/images/${imgPath}`}>
                            {imgPath}
                        </option>
                    ))}
                </select>

                <label>Description:</label>
                <textarea
                    name="description"
                    placeholder="Description"
                    value={movie.description || ""}
                    onChange={handleInputChange}
                    rows={5}
                    disabled={loading}
                    style={{ resize: "vertical" }}
                />

                <label>
                    <input
                        type="checkbox"
                        checked={movie.released || false}
                        onChange={handleCheckboxChange}
                        disabled={loading}
                    />
                    Released
                </label>

                <div className="modal-buttons">
                    <button onClick={handleSubmit} disabled={loading}>
                        {loading ? (isUpdateMode ? "Updating..." : "Adding...") : isUpdateMode ? "Update" : "Add"}
                    </button>
                    <button onClick={onClose} disabled={loading}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default MovieModal;
