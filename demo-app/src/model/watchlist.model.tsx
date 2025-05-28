export interface WatchlistItem {
    id: string;           // UUID of the watchlist entry
    personId: string;
    personName: string;
    movieId: string;
    movieTitle: string;
    addedAt: string;
    released: boolean; // ISO date string
}
export default WatchlistItem;