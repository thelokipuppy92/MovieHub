import React, { useState, useEffect } from 'react';
import Movie from '../model/movie.model';
import { MovieService } from '../service/MovieService';
import DataTable, { TableColumn } from 'react-data-table-component';
import ActorSelectionModal from './ActorSelectionModal';

interface MovieTableProps {
    loading: boolean;
    isError: boolean;
    onRowSelected: (state: { selectedRows: Movie[] }) => void;
    theme: 'light' | 'dark';
}

function MovieTable({ loading, isError, onRowSelected, theme }: MovieTableProps) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [showActorModal, setShowActorModal] = useState(false);

    const columns: TableColumn<Movie>[] = [
        { name: 'ID', selector: (row: Movie) => row.id, sortable: true },
        { name: 'Title', selector: (row: Movie) => row.title, sortable: true },
        { name: 'Release Year', selector: (row: Movie) => row.releaseYear, sortable: true },
        { name: 'Genre', selector: (row: Movie) => row.genre, sortable: true },
        {
            name: 'Director',
            selector: (row: Movie) => row.directorName || 'No Director',
            sortable: true,
        },
    ];

    const handleRowSelected = (state: { selectedRows: Movie[] }) => {
        const movie = state.selectedRows[0] || null;
        setSelectedMovie(movie);
        onRowSelected(state);
    };

    const handleAssignActors = () => {
        if (selectedMovie) {
            setShowActorModal(true);
        } else {
            alert('Please select a movie first!');
        }
    };

    const fetchMovies = async () => {
        try {
            const movies = await MovieService.getMovies();
            setMovies(movies);
        } catch (error) {
            console.error('Error fetching movies', error);
        }
    };

    useEffect(() => {
        fetchMovies();

        const handleMovieListUpdated = () => {
            fetchMovies();
        };


        window.addEventListener('movieListUpdated', handleMovieListUpdated);

        return () => {
            window.removeEventListener('movieListUpdated', handleMovieListUpdated);
        };
    }, []);

    return (
        <>
            {loading ? (
                <p className="loading-text">Loading...</p>
            ) : isError ? (
                <p className="error-text">An error occurred while fetching data.</p>
            ) : (
                <div className="table-container">
                    <DataTable
                        title="Movies"
                        columns={columns}
                        data={movies}
                        pagination
                        highlightOnHover
                        selectableRows
                        onSelectedRowsChange={handleRowSelected}
                        theme={theme === "dark" ? "dark" : "default"}
                    />
                    <button onClick={handleAssignActors} className="assign-actors-btn">
                        Assign Actors
                    </button>

                    {showActorModal && (
                        <ActorSelectionModal
                            isOpen={showActorModal}
                            onClose={() => setShowActorModal(false)}
                            movie={selectedMovie}
                        />
                    )}
                </div>
            )}
        </>
    );
}

export default MovieTable;
