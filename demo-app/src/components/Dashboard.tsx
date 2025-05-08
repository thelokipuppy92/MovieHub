import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MovieService } from "../service/MovieService.ts";
import { DirectorService } from "../service/DirectorService.ts";
import { ActorService } from "../service/ActorService.ts";
import ThemeSwitcher from "../components/ThemeSwitcher";
import MovieTable from "../components/MovieTable";
import DirectorTable from "../components/DirectorTable";
import ActorTable from "../components/ActorTable";
import useMovieActions from "../hooks/useMovieActions.ts";
import useMovieModal from "../hooks/useMovieModal.ts";
import Movie from "../model/movie.model.tsx";
import useActorActions from "../hooks/useActorActions.ts";
import useActorModal from "../hooks/useActorModal.ts";
import Actor from "../model/actor.model.tsx";
import Director from "../model/director.model.tsx";
import useDirectorModal from "../hooks/useDirectorModal.ts";
import useDirectorActions from "../hooks/useDirectorActions.ts";
import {ReviewService} from "../service/ReviewService.ts";
import Review from "../model/review.model.tsx";
import {toast, ToastContainer} from "react-toastify";
import {PersonService} from "../service/PersonService.ts";
import  '../config/axiosConfig.ts';


const Dashboard = () => {
    const navigate = useNavigate();
    const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
    const handleThemeChange = (newTheme: 'light' | 'dark') => {
        setCurrentTheme(newTheme);
    };

    // --- Movie Section ---
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loadingMovies, setLoadingMovies] = useState(true);
    const [isErrorMovies, setIsErrorMovies] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('title');
    const [sortOrder, setSortOrder] = useState<string>('asc');
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    const [availableGenres, setAvailableGenres] = useState<string[]>([]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const genres = await MovieService.getAvailableGenres();
                setAvailableGenres(genres);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        fetchGenres();
    }, []);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoadingMovies(true);
            setIsErrorMovies(false);
            try {
                const response = await MovieService.getMovies1({
                    search: searchQuery || '',
                    genre: selectedGenre || '',
                    sortBy: sortBy || 'title',
                    sortOrder: sortOrder || 'asc',
                });

                setMovies(response);
                setLoadingMovies(false);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setLoadingMovies(false);
                setIsErrorMovies(true);
            }
        };

        fetchMovies();
    }, [selectedGenre, searchQuery, sortBy, sortOrder]);

    const {
        isModalOpen: isMovieModalOpen,
        isUpdateMode: isMovieUpdateMode,
        newMovie,
        openModal: openMovieModal,
        closeModal: closeMovieModal
    } = useMovieModal({ selectedMovie });

    const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGenre(event.target.value);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const [newSortBy, newSortOrder] = event.target.value.split(',');

        if (newSortBy && newSortOrder) {
            setSortBy(newSortBy);
            setSortOrder(newSortOrder);
        }
    };

    const handleMovieRowSelected = (state: { selectedRows: Movie[] }) => {
        setSelectedMovie(state.selectedRows[0] || null);
    };

    // --- Review Handling ---
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [userReview, setUserReview] = useState<string>('');
    const [userRating, setUserRating] = useState<number>(0);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [existingReview, setExistingReview] = useState<Review | null>(null);

    useEffect(() => {
        if (selectedMovie) {
            // Reset review states when a new movie is selected
            setHasReviewed(false);
            setExistingReview(null);
            setUserReview('');
            setUserRating(0);
        }
    }, [selectedMovie]);

    const handleReviewButtonClick = async () => {
        setIsReviewModalOpen(false);
        if (selectedMovie) {
            const personId = sessionStorage.getItem('personId');
            if (!personId) {
                alert('Please log in to write a review.');
                return;
            }

            //check if the user has already submitted a review
            try {
                const reviews = await ReviewService.getReviewsByMovieId(selectedMovie.id);
                const userReview = reviews.find((review) => review.personId === personId);

                if (userReview) {
                    //if user has already reviewed, set the existing review
                    setExistingReview(userReview);
                    setUserReview(userReview.comment);
                    setUserRating(userReview.rating);
                    setHasReviewed(true);
                    toast.info('You have already submitted a review. You can update it below.');
                } else {
                    setHasReviewed(false);
                }
                setIsReviewModalOpen(true);
            } catch (error) {
                console.error('Error fetching reviews:', error);
                toast.error('Error fetching review status.');
            }
        }
    };

    const handleSubmitReview = async () => {
        if (userRating < 1 || userRating > 10) {
            toast.error('Rating must be between 1 and 10.');
            return;
        }

        if (userReview.trim() === '') {
            toast.error('Please write a review.');
            return;
        }

        if (!selectedMovie?.id) {
            toast.error('Movie ID is missing.');
            return;
        }

        //retrieve the logged-in person's ID
        const personId = sessionStorage.getItem('personId');
        if (!personId) {
            alert('User not logged in. Please log in to submit a review.');
            return;
        }

        try {
            const reviewData = {
                movieId: selectedMovie.id,
                comment: userReview,
                rating: userRating,
                personId: personId,
            };

            if (existingReview) {
                const updatedReview = await ReviewService.editReview(existingReview.id, reviewData);
                toast.success('Review updated successfully!');
            } else {
                await ReviewService.submitReview(reviewData);
                toast.success('Review submitted successfully!');
            }

            setIsReviewModalOpen(false);
            setHasReviewed(true);
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('There was an error submitting your review.');
        }
    };

    const [reviews, setReviews] = useState<Review[]>([]);
    const [isViewingReviews, setIsViewingReviews] = useState(false);

    /*
    const handleSeeReviewsClick = async () => {
        if (selectedMovie) {
            try {
                const reviews = await ReviewService.getReviewsByMovieId(selectedMovie.id);
                setReviews(reviews);
                setIsViewingReviews(true);
            } catch (error) {
                console.error('Error fetching reviews:', error);
                toast.error('Error fetching reviews.');
            }
        }
    };

     */
    const handleSeeReviewsClick = async () => {
        if (selectedMovie) {
            try {

                const reviews = await ReviewService.getReviewsByMovieId(selectedMovie.id);
                const reviewsWithPersonId = reviews.map((review) => ({
                    ...review,
                    personId: review.personId,
                }));
                setReviews(reviewsWithPersonId);
                setIsViewingReviews(true);
            } catch (error) {
                console.error('Error fetching reviews:', error);
                toast.error('Error fetching reviews.');
            }
        }
    };



    const handleDeleteReview = async () => {
        if (existingReview) {
            try {
                await ReviewService.deleteReview(existingReview.id);
                toast.success('Review deleted successfully!');

                setIsReviewModalOpen(false);
                setHasReviewed(false);
                setExistingReview(null);
            } catch (error) {
                console.error('Error deleting review:', error);
                toast.error('There was an error deleting your review.');
            }
        }
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

    const handleLogout = () => {
        sessionStorage.removeItem('personId');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user_role');

        toast.info('Logged out successfully!');
        navigate('/login');
    };


    return (
        <div className="app-container">
            <ThemeSwitcher onThemeChange={handleThemeChange} />
            <h1>User Dashboard</h1>

            {/* Genre Filter */}
            <div>
                <label>Genre: </label>
                <select value={selectedGenre} onChange={handleGenreChange}>
                    <option value="">All Genres</option>
                    {availableGenres.map((genre) => (
                        <option key={genre} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Search by Title */}
            <div>
                <label>Search by Title: </label>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by title"
                />
            </div>

            {/* Sort By */}
            <div>
                <label>Sort by: </label>
                <select value={`${sortBy},${sortOrder}`} onChange={handleSortChange}>
                    <option value="">Select sorting option</option>
                    <option value="title,asc">Title (A-Z)</option>
                    <option value="title,desc">Title (Z-A)</option>
                    <option value="releaseYear,asc">Release Year (Ascending)</option>
                    <option value="releaseYear,desc">Release Year (Descending)</option>
                </select>
            </div>

            {/* Movie Table */}
            <MovieTable
                data={movies}
                loading={loadingMovies}
                isError={isErrorMovies}
                onRowSelected={handleMovieRowSelected}
                theme={currentTheme}
            />

            {/* Movie Actions */}
            {selectedMovie && (
                <div className="actions-container">
                    {!hasReviewed && (
                        <button onClick={handleReviewButtonClick} className="write-review-btn">
                            Write a Review
                        </button>
                    )}
                    <button onClick={handleSeeReviewsClick} className="see-reviews-btn">
                        See All Reviews
                    </button>
                </div>
            )}

            {/* Review Modal */}
            {isReviewModalOpen && selectedMovie && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>
                            {hasReviewed
                                ? `Edit Your Review for ${selectedMovie.title}`
                                : `Submit Review for ${selectedMovie.title}`}
                        </h2>

                        {/* Editable Fields for Review */}
                        {hasReviewed ? (
                            // If review exists, show fields for editing and delete option
                            <>
                    <textarea
                        value={userReview}
                        onChange={(e) => setUserReview(e.target.value)}
                        placeholder="Edit your review here..."
                    />
                                <div>
                                    <label>Rating: </label>
                                    <input
                                        type="number"
                                        value={userRating}
                                        onChange={(e) => setUserRating(Number(e.target.value))}
                                        min="1"
                                        max="10"
                                        placeholder="Rating (1-10)"
                                    />
                                </div>
                                <button onClick={handleSubmitReview}>
                                    Update Review
                                </button>

                                {/* Delete Review Button */}
                                <button onClick={handleDeleteReview} className="delete-review-btn">
                                    Delete Review
                                </button>
                            </>
                        ) : (
                            // If review does not exist, show fields for new review
                            <>
                    <textarea
                        value={userReview}
                        onChange={(e) => setUserReview(e.target.value)}
                        placeholder="Write your review here..."
                    />
                                <div>
                                    <label>Rating: </label>
                                    <input
                                        type="number"
                                        value={userRating}
                                        onChange={(e) => setUserRating(Number(e.target.value))}
                                        min="1"
                                        max="10"
                                        placeholder="Rating (1-10)"
                                    />
                                </div>
                                <button onClick={handleSubmitReview}>
                                    Submit Review
                                </button>
                            </>
                        )}

                        <button onClick={() => setIsReviewModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}


            {/* Review Display Modal */}
            {isViewingReviews && selectedMovie && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Reviews for {selectedMovie.title}</h2>
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review.id} className="review-item">
                                    <p><strong>Rating:</strong> {review.rating}/10</p>
                                    <p><strong>Comment:</strong> {review.comment}</p>

                                    {review.personId && (
                                        <p><strong>Reviewed by:</strong> {review.personId}</p>
                                    )}

                                    <hr />
                                </div>
                            ))
                        ) : (
                            <p>No reviews available for this movie.</p>
                        )}
                        <button onClick={() => setIsViewingReviews(false)}>Close</button>
                    </div>
                </div>
            )}



            {/* Actor Table */}
            <ActorTable
                data={actors}
                loading={loadingActors}
                isError={isErrorActors}
                onRowSelected={handleActorRowSelected}
                theme={currentTheme}
            />
            <DirectorTable
                data={directors}
                loading={loadingDirectors}
                isError={isErrorDirectors}
                onRowSelected={handleDirectorRowSelected}
                theme={currentTheme}
            />
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
};

export default Dashboard;


