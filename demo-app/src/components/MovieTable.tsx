import React, { useState } from 'react';
import Movie from '../model/movie.model';
import DataTable, { TableColumn } from 'react-data-table-component';
import ActorSelectionModal from './ActorSelectionModal';

interface MovieTableProps {
    data: Movie[];
    loading: boolean;
    isError: boolean;
    onRowSelected: (state: { selectedRows: Movie[] }) => void;
    theme: 'light' | 'dark';
}

function MovieTable({ data, loading, isError, onRowSelected, theme }: MovieTableProps) {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [showActorModal, setShowActorModal] = useState(false);

    // New state for showing description modal
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [movieDescription, setMovieDescription] = useState<string>('');

    const columns: TableColumn<Movie>[] = [
        {
            name: 'Poster',
            cell: (row: Movie) =>
                row.imageUrl ? (
                    <img
                        src={row.imageUrl}
                        alt={row.title}
                        style={{
                            width: '60px',
                            height: '90px',
                            borderRadius: '4px',
                            objectFit: 'cover'
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: '60px',
                            height: '90px',
                            backgroundColor: '#ddd',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '4px',
                            fontSize: '10px',
                            color: '#666'
                        }}
                    >
                        No Image
                    </div>
                ),
            width: '80px'
        },
        { name: 'Title', selector: (row: Movie) => row.title, sortable: true },
        { name: 'Release Year', selector: (row: Movie) => row.releaseYear, sortable: true },
        { name: 'Genre', selector: (row: Movie) => row.genre, sortable: true },
        {
            name: 'Director',
            selector: (row: Movie) => row.directorName || 'No Director',
            sortable: true
        },

        // New Released column
        {
            name: 'Released',
            selector: (row: Movie) => (row.released ? 'Yes' : 'No'),
            sortable: true,
            center: true,
            width: '90px',
        },

        {
            name: 'Description',
            cell: (row: Movie) => (
                <button
                    onClick={() => {
                        setMovieDescription(row.description || 'No description available.');
                        setShowDescriptionModal(true);
                    }}
                    style={{
                        padding: '5px 10px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        borderRadius: '4px'
                    }}
                >
                    View Description
                </button>
            ),
            ignoreRowClick: true,
            width: '150px'
        }
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

    const userRole = localStorage.getItem('user_role');

    return (
        <>
            {loading ? (
                <p className="loading-text">Loading...</p>
            ) : isError ? (
                <p className="error-text">An error occurred while fetching data.</p>
            ) : (
                <div className="table-container" >
                    <DataTable
                        title="Movies"
                        columns={columns}
                        data={data}
                        pagination
                        highlightOnHover
                        selectableRows
                        onSelectedRowsChange={handleRowSelected}
                        theme={theme === 'dark' ? 'dark' : 'default'}
                    />

                    {userRole === 'ADMIN' && (
                        <button onClick={handleAssignActors} className="assign-actors-btn">
                            Assign Actors
                        </button>
                    )}

                    {showActorModal && selectedMovie && (
                        <ActorSelectionModal
                            isOpen={showActorModal}
                            onClose={() => setShowActorModal(false)}
                            movie={selectedMovie}
                        />
                    )}

                    {/* Description Modal */}
                    {showDescriptionModal && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 9999
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: '#888',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    width: '400px',
                                    maxHeight: '80vh',
                                    overflowY: 'auto',
                                    position: 'relative'
                                }}
                            >
                                <button
                                    onClick={() => setShowDescriptionModal(false)}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        fontSize: '18px',
                                        cursor: 'pointer',
                                        background: 'none',
                                        border: 'none'
                                    }}
                                    aria-label="Close description modal"
                                >
                                    &times;
                                </button>
                                <h2>Description</h2>
                                <p>{movieDescription}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default MovieTable;
