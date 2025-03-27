package com.andrei.demo.service;

import com.andrei.demo.model.*;
import com.andrei.demo.repository.ActorRepository;
import com.andrei.demo.repository.MovieRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.andrei.demo.repository.DirectorRepository;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

@Data
@Service
@AllArgsConstructor
public class MovieService {
    private final MovieRepository movieRepository;

    private final DirectorRepository directorRepository;

    private final DirectorService directorService;

    @Autowired
    private ActorRepository actorRepository;

    public MovieResponseDTO mapToResponseDTO(Movie movie) {
        MovieResponseDTO dto = new MovieResponseDTO();
        dto.setId(movie.getId());
        dto.setTitle(movie.getTitle());
        dto.setReleaseYear(movie.getReleaseYear());
        dto.setGenre(movie.getGenre());
        dto.setDirectorName(movie.getDirector().getName());
        dto.setDirectorId(movie.getDirector().getId().toString());
        return dto;
    }

    public Movie addMovie(MovieCreateDTO movieCreateDTO) {
        if (movieCreateDTO == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, " Movie data cannot be null");
        }

        try {
            UUID directorId = UUID.fromString(movieCreateDTO.getDirectorId());

            Director director = directorRepository.findById(directorId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Director not found"));

            Movie movie = new Movie();
            movie.setTitle(movieCreateDTO.getTitle());
            movie.setReleaseYear(movieCreateDTO.getReleaseYear());
            movie.setGenre(movieCreateDTO.getGenre());
            movie.setDirector(director);

            return movieRepository.save(movie);
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid UUID format: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid directorId format");
        } catch (Exception e) {
            System.err.println("Error adding movie: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error adding movie");
        }
    }

    public Movie updateMovie(UUID movieId, MovieUpdateDTO dto) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        if (dto.getDirectorId() == null || dto.getDirectorId().isEmpty()) {
            throw new IllegalArgumentException("Director ID cannot be null or empty");
        }
        UUID directorUuid = UUID.fromString(dto.getDirectorId());

        Director director = directorRepository.findById(directorUuid)
                .orElseThrow(() -> new RuntimeException("Director not found"));

        if (director.getName() == null || director.getName().isEmpty()) {
            throw new RuntimeException("Director's name cannot be null or empty");
        }

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
        try {
            Movie movie = movieRepository.findById(movieId)
                    .orElseThrow(() -> new RuntimeException("Movie not found"));

            List<UUID> actorIdsCopy = new ArrayList<>(actorIds);

            List<Actor> actors = actorRepository.findAllById(actorIdsCopy);

            Set<Actor> updatedActors = new HashSet<>(movie.getActors());

            updatedActors.addAll(actors);

            movie.setActors(updatedActors);

            movieRepository.save(movie);
        } catch (RuntimeException ex) {
            System.out.println("EXCEPTION: " + ex.getMessage());
        }
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }


    public List<Movie> getMoviesByGenre (String genre){
            return movieRepository.findByGenre(genre);}

    public List<Movie> getMoviesByDirector (UUID directorId){
            return movieRepository.findByDirectorId(directorId);}
    public Movie getMovie (UUID movieId){
            return movieRepository.findById(movieId)
                    .orElseThrow(() -> new IllegalStateException("Movie with ID " + movieId + " not found"));}

    public void deleteMovie (UUID movieId){
            Movie movie = movieRepository.findById(movieId)
                    .orElseThrow(() -> new IllegalStateException("Movie with ID " + movieId + " not found"));


            movieRepository.delete(movie);}
}
