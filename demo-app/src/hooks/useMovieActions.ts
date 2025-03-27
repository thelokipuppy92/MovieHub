import Movie from '../model/movie.model';
import { MovieService } from '../service/MovieService';
import { toast } from 'react-toastify';

interface UseMovieActionsProps {
    setDataMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
    setSelectedMovie: React.Dispatch<React.SetStateAction<Movie | null>>;
    selectedMovie: Movie | null;
}

const useMovieActions = ({ setDataMovies, setSelectedMovie, selectedMovie }: UseMovieActionsProps) => {
    const handleAddMovie = async (movie: Movie) => {
        if (!movie.title) {
            toast.error("Title is required!");
            return;
        }
        if (!movie.genre) {
            toast.error("Genre is required!");
            return;
        }
        if (!movie.releaseYear) {
            toast.error("Release year is required!");
            return;
        }
        if (movie.releaseYear < 1900) {
            toast.error("Release year should be at least 1900!");
            return;
        }

        try {
            console.log("Movie being added:", movie);
            if (!movie.directorId) {
                throw new Error('Director ID is required');
            }

            const addedMovie = await MovieService.addMovie(movie);
            setDataMovies(prevData => [...prevData, addedMovie]);
            toast.success('Movie added successfully!');
        } catch (error) {
            console.error('Error adding movie:', error);
            toast.error('Failed to add movie.');
        }
    };

    const handleUpdateMovie = async (movie: Movie) => {
        if (!selectedMovie) return;
        try {
            const payload = {
                title: movie.title,
                releaseYear: movie.releaseYear,
                genre: movie.genre,
                directorId: movie.directorId,
            };

            await MovieService.updateMovie(selectedMovie.id, payload);

            setDataMovies(prevData =>
                prevData.map(m => (m.id === selectedMovie.id ? { ...selectedMovie, ...movie } : m))
            );
            toast.success('Movie updated successfully!');
            const updateEvent = new Event('movieListUpdated');
            window.dispatchEvent(updateEvent);
        } catch (error) {
            console.error('Error updating movie:', error);
            toast.error('Failed to update movie!');
        }
    };

    const handleDeleteMovie = async () => {
        if (!selectedMovie) return;

        try {
            await MovieService.deleteMovie(selectedMovie.id);
            setDataMovies(prevData => prevData.filter(movie => movie.id !== selectedMovie.id));

            setSelectedMovie(null);
            toast.success('Movie deleted successfully!');

            const updateEvent = new Event('movieListUpdated');
            window.dispatchEvent(updateEvent);
        } catch (error) {
            console.error('Error deleting movie:', error);
            toast.error('Error deleting movie');
        }
    };

    return { handleAddMovie, handleUpdateMovie, handleDeleteMovie };
};

export default useMovieActions;
