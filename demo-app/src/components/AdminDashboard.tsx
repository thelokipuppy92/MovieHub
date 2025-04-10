import React, { useState, useEffect } from 'react';
//import './App.css';
import { ToastContainer } from 'react-toastify';
import Person from "../model/person.model.tsx";
import ThemeSwitcher from "./ThemeSwitcher.tsx";
import PersonTable from "./PersonTable.tsx";
import { PersonService } from "../service/PersonService.ts";
import PersonModal from "./PersonModal.tsx";
import usePersonActions from "../hooks/usePersonActions.ts";
import usePersonModal from "../hooks/usePersonModal.ts";

// Import statements for Movie section
import Movie from "../model/movie.model";
import MovieTable from "./MovieTable";
import { MovieService } from "../service/MovieService";
import MovieModal from "./MovieModal";
import useMovieActions from "../hooks/useMovieActions";
import useMovieModal from "../hooks/useMovieModal";

// Import statements for Actor section
import Actor from "../model/actor.model";
import ActorTable from "../components/ActorTable";
import { ActorService } from "../service/ActorService";
import ActorModal from "./ActorModal";
import useActorActions from "../hooks/useActorActions";
import useActorModal from "../hooks/useActorModal";

// Import statements for Director section
import Director from "../model/director.model";
import DirectorTable from "./DirectorTable";
import { DirectorService } from "../service/DirectorService";
import DirectorModal from "./DirectorModal";
import useDirectorActions from "../hooks/useDirectorActions";
import useDirectorModal from "../hooks/useDirectorModal";
import {useNavigate} from "react-router-dom";


function AdminDashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        fetchData();
    }, []);

    const { handleAddPerson, handleUpdatePerson, handleDeletePerson } =
        usePersonActions({
            setData,
            setSelectedPerson,
            selectedPerson,
        });

    const {
        isModalOpen,
        isUpdateMode,
        newPerson,
        openModal,
        closeModal,
    } = usePersonModal({ selectedPerson });

    const fetchData = async () => {
        setLoading(true);
        setIsError(false);
        try {
            const persons = await PersonService.getPersons();
            setData(persons);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
            setIsError(true);
        }
    };

    const handleRowSelected = (state: { selectedRows: Person[] }) => {
        setSelectedPerson(state.selectedRows[0] || null);
    };

    const handleThemeChange = (newTheme: 'light' | 'dark') => {
        setCurrentTheme(newTheme);
    };

    // --- Movie Section ---
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loadingMovies, setLoadingMovies] = useState(true);
    const [isErrorMovies, setIsErrorMovies] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    useEffect(() => {
        fetchMovies();
    }, []);

    const { handleAddMovie, handleUpdateMovie, handleDeleteMovie } =
        useMovieActions({
            setDataMovies: setMovies,
            setSelectedMovie,
            selectedMovie,
        });

    const {
        isModalOpen: isMovieModalOpen,
        isUpdateMode: isMovieUpdateMode,
        newMovie,
        openModal: openMovieModal,
        closeModal: closeMovieModal
    } = useMovieModal({ selectedMovie });

    const fetchMovies = async () => {
        setLoadingMovies(true);
        setIsErrorMovies(false);
        try {
            const moviesData = await MovieService.getMovies();
            setMovies(moviesData);
            setLoadingMovies(false);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setLoadingMovies(false);
            setIsErrorMovies(true);
        }
    };

    const handleMovieRowSelected = (state: { selectedRows: Movie[] }) => {
        setSelectedMovie(state.selectedRows[0] || null);
    };

    // --- Actor Section ---
    const [actors, setActors] = useState<Actor[]>([]);
    const [loadingActors, setLoadingActors] = useState(true);
    const [isErrorActors, setIsErrorActors] = useState(false);
    const [selectedActor, setSelectedActor] = useState<Actor | null>(null);

    const fetchActors = async () => {
        setLoadingActors(true);
        setIsErrorActors(false);
        try {
            const actors = await ActorService.getActors();
            setActors(actors);
            setLoadingActors(false);
        } catch (error) {
            console.error('Error fetching actors:', error);
            setLoadingActors(false);
            setIsErrorActors(true);
        }
    };

    useEffect(() => {
        fetchActors();
    }, []);

    const { handleAddActor, handleUpdateActor, handleDeleteActor } =
        useActorActions({
            setDataActors: setActors,
            setSelectedActor,
            selectedActor,
        });

    const {
        isModalOpen: isActorModalOpen,
        isUpdateMode: isActorUpdateMode,
        newActor,
        openModal: openActorModal,
        closeModal: closeActorModal,
    } = useActorModal({ selectedActor });

    const handleActorRowSelected = (state: { selectedRows: Actor[] }) => {
        setSelectedActor(state.selectedRows[0] || null);
    };

    // --- Director Section ---
    const [directors, setDirectors] = useState<Director[]>([]);
    const [loadingDirectors, setLoadingDirectors] = useState(true);
    const [isErrorDirectors, setIsErrorDirectors] = useState(false);
    const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);
    const [showDirectorMovies, setShowDirectorMovies] = useState(false); // Show/hide toggle for director's movies

    useEffect(() => {
        fetchDirectors();
    }, []);

    const { handleAddDirector, handleUpdateDirector, handleDeleteDirector } =
        useDirectorActions({
            setDataDirectors: setDirectors,
            setSelectedDirector,
            selectedDirector,
        });

    const {
        isModalOpen: isDirectorModalOpen,
        isUpdateMode: isDirectorUpdateMode,
        newDirector,
        openModal: openDirectorModal,
        closeModal: closeDirectorModal,
    } = useDirectorModal({ selectedDirector });

    const fetchDirectors = async () => {
        setLoadingDirectors(true);
        setIsErrorDirectors(false);
        try {
            const directors = await DirectorService.getDirectors();
            setDirectors(directors);
            setLoadingDirectors(false);
        } catch (error) {
            console.error('Error fetching directors:', error);
            setLoadingDirectors(false);
            setIsErrorDirectors(true);
        }
    };

    const handleDirectorRowSelected = (state: { selectedRows: Director[] }) => {
        setSelectedDirector(state.selectedRows[0] || null);
    };


    // Filter movies based on the selected director
    const filteredMovies = selectedDirector
        ? movies.filter(movie => movie.directorId === selectedDirector.id)
        : movies;


    const toggleDirectorMovies = () => {
        setShowDirectorMovies(!showDirectorMovies);
    };

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        navigate('/login');
    };

    return (
        <div className="app-container">
            <h1>Person List</h1>
            <ThemeSwitcher onThemeChange={handleThemeChange} />
            <div className="button-group">
                <button onClick={() => openModal()}>Add</button>
                <button onClick={() => openModal(true)} disabled={!selectedPerson}>Update</button>
                <button onClick={handleDeletePerson} disabled={!selectedPerson}>Delete</button>
            </div>
            <br />
            <PersonTable
                data={data}
                loading={loading}
                isError={isError}
                onRowSelected={handleRowSelected}
                theme={currentTheme}
            />
            <PersonModal
                isOpen={isModalOpen}
                isUpdateMode={isUpdateMode}
                initialPerson={newPerson}
                onClose={closeModal}
                onAdd={handleAddPerson}
                onUpdate={handleUpdatePerson}
            />

            {/* --- Movie Section --- */}
            <div className="section">
                <h2>Movie List</h2>
                <div className="button-group">
                    <button onClick={() => openMovieModal()}>Add Movie</button>
                    <button onClick={() => openMovieModal(true)} disabled={!selectedMovie}>Update Movie</button>
                    <button onClick={handleDeleteMovie} disabled={!selectedMovie}>Delete Movie</button>
                </div>
                <MovieTable
                    data={movies}
                    loading={loadingMovies}
                    isError={isErrorMovies}
                    onRowSelected={handleMovieRowSelected}
                    theme={currentTheme}
                />
                <MovieModal
                    isOpen={isMovieModalOpen}
                    isUpdateMode={isMovieUpdateMode}
                    initialMovie={newMovie}
                    onClose={closeMovieModal}
                    onAdd={handleAddMovie}
                    onUpdate={handleUpdateMovie}
                />

                {/* --- Actor Section --- */}
                <div className="section">
                    <h2>Actor List</h2>
                    <div className="button-group">
                        <button onClick={() => openActorModal()}>Add Actor</button>
                        <button onClick={() => openActorModal(true)} disabled={!selectedActor}>Update Actor</button>
                        <button onClick={handleDeleteActor} disabled={!selectedActor}>Delete Actor</button>
                    </div>
                    <ActorTable
                        data={actors}
                        loading={loadingActors}
                        isError={isErrorActors}
                        onRowSelected={handleActorRowSelected}
                        theme={currentTheme}
                    />
                    <ActorModal
                        isOpen={isActorModalOpen}
                        isUpdateMode={isActorUpdateMode}
                        initialActor={newActor}
                        onClose={closeActorModal}
                        onAdd={handleAddActor}
                        onUpdate={handleUpdateActor}
                    />
                </div>

                {/* Director Section */}
                <div className="section">
                    <h2>Director List</h2>
                    <div className="button-group">
                        <button onClick={() => openDirectorModal()}>Add Director</button>
                        <button onClick={() => openDirectorModal(true)} disabled={!selectedDirector}>Update Director</button>
                        <button onClick={handleDeleteDirector} disabled={!selectedDirector}>Delete Director</button>
                    </div>
                    <DirectorTable
                        data={directors}
                        loading={loadingDirectors}
                        isError={isErrorDirectors}
                        onRowSelected={handleDirectorRowSelected}
                        theme={currentTheme}
                    />
                    <DirectorModal
                        isOpen={isDirectorModalOpen}
                        isUpdateMode={isDirectorUpdateMode}
                        initialDirector={newDirector}
                        onClose={closeDirectorModal}
                        onAdd={handleAddDirector}
                        onUpdate={handleUpdateDirector}
                    />

                    {/* --- Movie List for Selected Director --- */}
                    {selectedDirector && (
                        <div>
                            <button onClick={toggleDirectorMovies}>
                                {showDirectorMovies ? "Hide Movies" : "Show Movies Directed by " + selectedDirector.name}
                            </button>
                            {showDirectorMovies && (
                                <div>
                                    <h3>Movies Directed by {selectedDirector.name}</h3>
                                    {filteredMovies.length > 0 ? (
                                        <MovieTable
                                            data={filteredMovies}
                                            loading={loadingMovies}
                                            isError={isErrorMovies}
                                            theme={currentTheme}
                                        />
                                    ) : (
                                        <p>No movies found for this director.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {/* ToastContainer  */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeButton={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {/* Logout Button */}
            <button onClick={handleLogout}>Logout</button>
        </div>

    );
}

export default AdminDashboard;