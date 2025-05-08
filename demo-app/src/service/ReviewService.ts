import axios from 'axios';
import { REVIEW_ENDPOINT } from '../constants/api';
import Review from '../model/review.model';

export class ReviewService {
    static async getReviewsByMovieId(movieId: string): Promise<Review[]> {
        const response = await axios.get(`${REVIEW_ENDPOINT}/${movieId}`);
        console.log('Fetched reviews response:', response.data);
        return response.data;
    }


    static async submitReview(review: Omit<Review, 'id'>): Promise<Review> {
        const personId = sessionStorage.getItem('personId');
        if (!personId) throw new Error('User is not logged in');

        const response = await axios.post(REVIEW_ENDPOINT, {
            ...review,
            personId,
            movieId: review.movieId,
        });

        return response.data;
    }

    static async editReview(reviewId: string, review: Omit<Review, 'id'>): Promise<Review> {
        const response = await axios.put(`${REVIEW_ENDPOINT}/${reviewId}`, review);
        return response.data;
    }

    static async deleteReview(reviewId: string): Promise<void> {
        await axios.delete(`${REVIEW_ENDPOINT}/${reviewId}`);
    }
}
