import DataTable, { TableColumn } from 'react-data-table-component';
import Actor from '../model/actor.model';
import { useState } from "react";
import ActorMovieModal from './ActorMovieModal';

interface ActorTableProps {
    data: Actor[];
    loading: boolean;
    isError: boolean;
    onRowSelected: (state: { selectedRows: Actor[] }) => void;
    theme: 'light' | 'dark';
}

function ActorTable({ data, loading, isError, onRowSelected, theme }: ActorTableProps) {
    const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
    const [showMoviesModal, setShowMoviesModal] = useState(false);


    const columns: TableColumn<Actor>[] = [
        { name: 'ID', selector: (row: Actor) => row.id, sortable: true },
        { name: 'Name', selector: (row: Actor) => row.name, sortable: true },
        { name: 'Email', selector: (row: Actor) => row.email, sortable: true },
        { name: 'Age', selector: (row: Actor) => row.age.toString(), sortable: true },
    ];

    const handleViewMovies = (actor: Actor) => {
        setSelectedActor(actor);
        setShowMoviesModal(true);
    };

    const handleRowSelect = (state: { selectedRows: Actor[] }) => {
        if (state.selectedRows.length > 0) {
            setSelectedActor(state.selectedRows[0]);
        } else {
            setSelectedActor(null);
        }
        onRowSelected(state);
    };


    return (
        <>
            {loading ? (
                <p className="loading-text">Loading...</p>
            ) : isError ? (
                <p className="error-text">An error occurred while fetching data</p>
            ) : (
                <div className="table-container">
                    {/* Render DataTable with Actor Data */}
                    <DataTable
                        title="Actors"
                        columns={columns}
                        data={data}
                        pagination
                        highlightOnHover
                        selectableRows
                        onSelectedRowsChange={handleRowSelect}
                        theme={theme === "dark" ? "dark" : "default"}
                    />

                    {/* Render the button outside the table */}
                    <div className="actions-container">
                        <button
                            onClick={() => selectedActor && handleViewMovies(selectedActor)}
                            className="view-movies-btn"
                            disabled={!selectedActor}
                        >
                            View Movies
                        </button>

                    </div>

                    {/* Render the Movie Modal if selected actor is available */}
                    {showMoviesModal && selectedActor && (
                        <ActorMovieModal
                            actor={selectedActor}
                            onClose={() => setShowMoviesModal(false)}
                        />
                    )}
                </div>
            )}
        </>
    );
}

export default ActorTable;
