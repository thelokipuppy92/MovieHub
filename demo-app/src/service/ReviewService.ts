import { REVIEW_ENDPOINT } from '../constants/api';
import Review from '../model/review.model';

export class ReviewService {

    static async getReviewsByMovieId(movieId: string): Promise<Review[]> {
        const response = await fetch(`${REVIEW_ENDPOINT}/${movieId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }
        return response.json();
    }


    static async submitReview(review: Omit<Review, 'id'>): Promise<Review> {
        const personId = localStorage.getItem('personId');
        console.log('Person ID from localStorage:', personId);

        if (!personId) {
            throw new Error('User is not logged in');
        }

        const movieId = review.movieId;
        const reviewWithPersonId = {
            ...review,
            personId,
            movieId,
        };
        console.log('Review data being sent to the server:', reviewWithPersonId);

        const response = await fetch(REVIEW_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewWithPersonId),
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('Server error details:', errorDetails);
            throw new Error('Failed to submit review');
        }

        return response.json();
    }


    static async editReview(reviewId: string, review: Omit<Review, 'id'>): Promise<Review> {
        const response = await fetch(`${REVIEW_ENDPOINT}/${reviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(review),
        });
        if (!response.ok) {
            throw new Error('Failed to update review');
        }
        return response.json();
    }

    static async deleteReview(reviewId: string): Promise<void> {
        const response = await fetch(`${REVIEW_ENDPOINT}/${reviewId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete review');
        }
    }


}
