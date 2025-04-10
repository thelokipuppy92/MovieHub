package com.andrei.demo.controller;

import com.andrei.demo.model.*;
import com.andrei.demo.service.DirectorService;
import com.andrei.demo.service.MovieService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@AllArgsConstructor
@CrossOrigin
public class MovieController {

    private final MovieService movieService;
    private final DirectorService directorService;

    @GetMapping("/movie/available-genres")
    public ResponseEntity<List<String>> getAvailableGenres() {
        List<String> genres = movieService.getAvailableGenres();
        return ResponseEntity.ok(genres);
    }

    @GetMapping("/movie/fil")
    public ResponseEntity<List<MovieResponseDTO>> getMovies1(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder) {

        List<MovieResponseDTO> movies = movieService.getMovies1(search, genre, sortBy, sortOrder);

        return ResponseEntity.ok(movies);
    }


    @GetMapping("/movie/{movieId}")
    public MovieResponseDTO getMovieById(@PathVariable UUID movieId) {
        Movie movie = movieService.getMovie(movieId);
        return movieService.mapToResponseDTO(movie);
    }

    @GetMapping("/movie")
    public List<MovieResponseDTO> getMovies() {
        return movieService.getAllMovies()
                .stream()
                .map(movieService::mapToResponseDTO)
                .toList();
    }

    @GetMapping("/movie/actor/{actorId}")
    public List<Movie> getMoviesByActor(@PathVariable UUID actorId) {
        return movieService.getMoviesByActor(actorId);
    }


    @PostMapping("/movie/{movieId}/actors")
    public ResponseEntity<?> assignActors(@PathVariable UUID movieId, @RequestBody List<UUID> actorIds) {
        try {
            movieService.assignActorsToMovie(movieId, actorIds);
            return ResponseEntity.ok().body(Map.of("message", "Actors assigned successfully"));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to assign actors"));
        }
    }

    @PostMapping("/movie/add")
    public MovieResponseDTO addMovie(@Valid @RequestBody MovieCreateDTO movieDTO) {
        Movie movie = movieService.addMovie(movieDTO);
        return movieService.mapToResponseDTO(movie);
    }

    @PutMapping("/movie/{movieId}")
    public MovieResponseDTO updateMovie(@PathVariable UUID movieId, @RequestBody MovieUpdateDTO dto) {
        Movie movie = movieService.updateMovie(movieId, dto);
        return movieService.mapToResponseDTO(movie);
    }

    @GetMapping("/movie/genre/{genre}")
    public List<Movie> getMoviesByGenre(@PathVariable String genre) {
        return movieService.getMoviesByGenre(genre);
    }

    @GetMapping("/movie/director/{directorId}")
    public List<Movie> getMoviesByDirector(@PathVariable UUID directorId) {
        return movieService.getMoviesByDirector(directorId);
    }

    @DeleteMapping("/movie/{movieId}")
    public void deleteMovie(@PathVariable UUID movieId) {
        movieService.deleteMovie(movieId);
    }
}
