import { useState } from 'react';
import Movie from '../model/movie.model';

interface UseMovieModalProps {
    selectedMovie: Movie | null;
}

const useMovieModal = ({ selectedMovie }: UseMovieModalProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [newMovie, setNewMovie] = useState<Movie>({
        id: '',
        title: '',
        releaseYear: 0,
        genre: '',
        directorId: '',
        description: "",
        imageUrl: "",
        released: false,
    });

    const openModal = (update = false) => {
        setIsModalOpen(true);
        setIsUpdateMode(update);

        if (update && selectedMovie) {
            setNewMovie({
                id: selectedMovie.id,
                title: selectedMovie.title,
                releaseYear: selectedMovie.releaseYear,
                genre: selectedMovie.genre,
                directorId: selectedMovie.directorId,
                description: selectedMovie.description || "",  // add this line
                imageUrl: selectedMovie.imageUrl || "",
                released: selectedMovie.released ?? false,
            });
        } else {
            setNewMovie({
                id: '',
                title: '',
                releaseYear: 0,
                genre: '',
                directorId: '',
                description: "",    // initialize empty string
                imageUrl: "",
                released: false,
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsUpdateMode(false);
        setNewMovie({
            id: '',
            title: '',
            releaseYear: 0,
            genre: '',
            directorId: '',
            description: "",    // add here
            imageUrl: "",
            released: false,

        });
    };

    return {
        isModalOpen,
        isUpdateMode,
        newMovie,
        openModal,
        closeModal,
        setNewMovie,
    };
};

export default useMovieModal;
