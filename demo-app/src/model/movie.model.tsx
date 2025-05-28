interface Movie {
    directorName?: string;
    id: string;
    title: string;
    releaseYear: number;
    genre: string;
    directorId: string;
    imageUrl?: string;
    imageFile?: File;
    description?: string;
    released?: boolean;

}

export default Movie;
