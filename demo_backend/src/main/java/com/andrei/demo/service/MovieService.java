package com.andrei.demo.service;

import com.andrei.demo.model.*;
import com.andrei.demo.repository.ActorRepository;
import com.andrei.demo.repository.DirectorRepository;
import com.andrei.demo.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final DirectorRepository directorRepository;
    private final ActorRepository actorRepository;

    public MovieResponseDTO mapToResponseDTO(Movie movie) {
        return new MovieResponseDTO(
                movie.getId(),
                movie.getTitle(),
                movie.getReleaseYear(),
                movie.getGenre(),
                movie.getDirector().getName(),
                movie.getDirector().getId().toString()
        );
    }

    public Movie addMovie(MovieCreateDTO movieCreateDTO) {
        return Optional.ofNullable(movieCreateDTO)
                .map(dto -> {
                    UUID directorId;
                    try {
                        directorId = UUID.fromString(dto.getDirectorId());
                    } catch (IllegalArgumentException e) {
                        System.err.println("Invalid UUID format: " + e.getMessage());
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid directorId format");
                    }

                    Director director = directorRepository.findById(directorId)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Director not found"));

                    Movie movie = new Movie();
                    movie.setTitle(dto.getTitle());
                    movie.setReleaseYear(dto.getReleaseYear());
                    movie.setGenre(dto.getGenre());
                    movie.setDirector(director);

                    try {
                        return movieRepository.save(movie);
                    } catch (Exception e) {
                        System.err.println("Error adding movie: " + e.getMessage());
                        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error adding movie");
                    }
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Movie data cannot be null"));
    }

    private Optional<Director> findDirectorById(String directorId) {
        try {
            return Optional.of(UUID.fromString(directorId))
                    .flatMap(directorRepository::findById);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid directorId format");
        }
    }

    public Movie updateMovie(UUID movieId, MovieUpdateDTO dto) {
        return movieRepository.findById(movieId)
                .map(existingMovie -> updateExistingMovie(existingMovie, dto))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));
    }

    private Movie updateExistingMovie(Movie movie, MovieUpdateDTO dto) {
        return Optional.ofNullable(dto.getDirectorId())
                .map(directorId -> findDirectorById(directorId)
                        .map(director -> applyMovieUpdate(movie, dto, director))
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Director not found")))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Director ID cannot be null"));
    }

    private Movie applyMovieUpdate(Movie movie, MovieUpdateDTO dto, Director director) {
        movie.setTitle(dto.getTitle());
        movie.setReleaseYear(dto.getReleaseYear());
        movie.setGenre(dto.getGenre());
        movie.setDirector(director);
        return movieRepository.save(movie);
    }

    public List<Movie> getMoviesByActor(UUID actorId) {
        return movieRepository.findByActors_Id(actorId);
    }

    public void assignActorsToMovie(UUID movieId, List<UUID> actorIds) {
        movieRepository.findById(movieId)
                .ifPresentOrElse(
                        movie -> updateMovieActors(movie, actorIds),
                        () -> {
                            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found");
                        }
                );
    }

    private void updateMovieActors(Movie movie, List<UUID> actorIds) {
        List<Actor> actors = actorRepository.findAllById(new HashSet<>(actorIds));
        movie.getActors().addAll(actors);
        movieRepository.save(movie);
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public List<Movie> getMoviesByGenre(String genre) {
        return movieRepository.findByGenre(genre);
    }

    public List<Movie> getMoviesByDirector(UUID directorId) {
        return movieRepository.findByDirectorId(directorId);
    }

    public Movie getMovie(UUID movieId) {
        return movieRepository.findById(movieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie with ID " + movieId + " not found"));
    }

    public void deleteMovie(UUID movieId) {
        movieRepository.findById(movieId)
                .ifPresentOrElse(
                        movie -> movieRepository.delete(movie),
                        () -> {
                            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie with ID " + movieId + " not found");
                        }
                );
    }

    public List<String> getAvailableGenres() {
        return movieRepository.findAll().stream()
                .map(Movie::getGenre)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<MovieResponseDTO> getMovies1(String search, String genre, String sortBy, String sortOrder) {
        return movieRepository.findAll().stream()
                .filter(movie -> genre == null || genre.isEmpty() || movie.getGenre().equalsIgnoreCase(genre))
                .filter(movie -> search == null || search.isEmpty() || movie.getTitle().toLowerCase().contains(search.toLowerCase()))
                .sorted((m1, m2) -> {
                    if (sortBy == null || sortBy.isEmpty()) return 0;

                    Comparator<Movie> comparator;
                    if ("title".equalsIgnoreCase(sortBy)) {
                        comparator = Comparator.comparing(Movie::getTitle);
                    } else if ("releaseYear".equalsIgnoreCase(sortBy)) {
                        comparator = Comparator.comparing(Movie::getReleaseYear);
                    } else {
                        return 0;
                    }

                    if ("desc".equalsIgnoreCase(sortOrder)) {
                        comparator = comparator.reversed();
                    }

                    return comparator.compare(m1, m2);
                })
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
}