// src/service/WatchlistService.ts

import axios from 'axios';
import { WATCHLIST_ENDPOINT } from '../constants/api';
import { WatchlistItem } from '../model/watchlist.model';

export class WatchlistService {
    static async getWatchlistByPersonId(personId: string): Promise<WatchlistItem[]> {
        const response = await axios.get(`${WATCHLIST_ENDPOINT}/${personId}`);
        console.log('Fetched watchlist:', response.data);
        return response.data;
    }

    static async addToWatchlist(personId: string, movieId: string): Promise<WatchlistItem> {
        const response = await axios.post(`${WATCHLIST_ENDPOINT}/${personId}/${movieId}`);
        return response.data;
    }

    static async removeFromWatchlist(personId: string, movieId: string): Promise<void> {
        await axios.delete(`${WATCHLIST_ENDPOINT}/${personId}/${movieId}`);
    }
}
