package com.andrei.demo.service;

import com.andrei.demo.model.*;
import com.andrei.demo.repository.MovieRepository;
import com.andrei.demo.repository.DirectorRepository;
import com.andrei.demo.repository.ActorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MovieServiceTests {

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private DirectorRepository directorRepository;

    @Mock
    private ActorRepository actorRepository;

    @InjectMocks
    private MovieService movieService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllMovies() {
        List<Movie> movies = List.of(new Movie(), new Movie());

        when(movieRepository.findAll()).thenReturn(movies);
        List<Movie> result = movieService.getAllMovies();

        assertEquals(2, result.size());
        verify(movieRepository, times(1)).findAll();
        assertEquals(movies, result);
    }

    @Test
    void testAddMovie() {
        MovieCreateDTO movieDTO = new MovieCreateDTO();
        movieDTO.setTitle("Inception");
        movieDTO.setReleaseYear(2010);
        movieDTO.setGenre("Sci-Fi");
        movieDTO.setDirectorId("123e4567-e89b-12d3-a456-426614174000");

        Director director = new Director();
        director.setId(UUID.fromString("123e4567-e89b-12d3-a456-426614174000"));
        director.setName("Christopher Nolan");

        Movie movieToSave = new Movie();
        movieToSave.setTitle("Inception");
        movieToSave.setReleaseYear(2010);
        movieToSave.setGenre("Sci-Fi");
        movieToSave.setDirector(director);

        Movie savedMovie = new Movie();
        savedMovie.setId(UUID.randomUUID());
        savedMovie.setTitle("Inception");
        savedMovie.setReleaseYear(2010);
        savedMovie.setGenre("Sci-Fi");
        savedMovie.setDirector(director);

        when(directorRepository.findById(UUID.fromString(movieDTO.getDirectorId()))).thenReturn(Optional.of(director));
        when(movieRepository.save(any(Movie.class))).thenReturn(savedMovie);

        Movie result = movieService.addMovie(movieDTO);

        assertEquals(savedMovie, result);
        assertNotNull(result.getId());
        verify(movieRepository, times(1)).save(any());
    }

    @Test
    void testUpdateMovie() {
        UUID movieId = UUID.randomUUID();
        Movie existingMovie = new Movie();
        existingMovie.setId(movieId);
        existingMovie.setTitle("Inception");
        existingMovie.setReleaseYear(2010);
        existingMovie.setGenre("Sci-Fi");

        MovieUpdateDTO updateDTO = new MovieUpdateDTO();
        updateDTO.setTitle("Interstellar");
        updateDTO.setReleaseYear(2014);
        updateDTO.setGenre("Sci-Fi");
        updateDTO.setDirectorId("123e4567-e89b-12d3-a456-426614174000");

        Director director = new Director();
        director.setId(UUID.fromString("123e4567-e89b-12d3-a456-426614174000"));
        director.setName("Christopher Nolan");

        Movie updatedMovie = new Movie();
        updatedMovie.setId(movieId);
        updatedMovie.setTitle("Interstellar");
        updatedMovie.setReleaseYear(2014);
        updatedMovie.setGenre("Sci-Fi");
        updatedMovie.setDirector(director);

        when(movieRepository.findById(movieId)).thenReturn(Optional.of(existingMovie));
        when(directorRepository.findById(UUID.fromString(updateDTO.getDirectorId()))).thenReturn(Optional.of(director));
        when(movieRepository.save(any(Movie.class))).thenReturn(updatedMovie);

        Movie result = movieService.updateMovie(movieId, updateDTO);

        assertEquals("Interstellar", result.getTitle());
        assertEquals(2014, result.getReleaseYear());
        assertEquals("Sci-Fi", result.getGenre());
        verify(movieRepository, times(1)).findById(movieId);
        verify(movieRepository, times(1)).save(any());
    }

    @Test
    void testGetMoviesByGenre() {
        String genre = "Sci-Fi";
        List<Movie> movies = List.of(new Movie(), new Movie());

        when(movieRepository.findByGenre(genre)).thenReturn(movies);
        List<Movie> result = movieService.getMoviesByGenre(genre);

        assertEquals(2, result.size());
        verify(movieRepository, times(1)).findByGenre(genre);
    }

    @Test
    void testDeleteMovie() {
        UUID movieId = UUID.randomUUID();
        Movie movie = new Movie();
        movie.setId(movieId);
        movie.setTitle("Test Movie");

        when(movieRepository.findById(movieId)).thenReturn(Optional.of(movie));
        doNothing().when(movieRepository).delete(movie);

        movieService.deleteMovie(movieId);

        verify(movieRepository, times(1)).findById(movieId);  // Verify that findById was called
        verify(movieRepository, times(1)).delete(movie);      // Verify that delete was called
    }


    @Test
    void testGetMoviesByDirector() {
        UUID directorId = UUID.randomUUID();
        List<Movie> movies = List.of(new Movie(), new Movie());

        when(movieRepository.findByDirectorId(directorId)).thenReturn(movies);
        List<Movie> result = movieService.getMoviesByDirector(directorId);

        assertEquals(2, result.size());
        verify(movieRepository, times(1)).findByDirectorId(directorId);
    }

    @Test
    void testAssignActorsToMovie() {
        UUID movieId = UUID.randomUUID();
        UUID actorId1 = UUID.randomUUID();
        UUID actorId2 = UUID.randomUUID();

        Actor actor1 = new Actor();
        actor1.setId(actorId1);
        actor1.setName("Actor One");

        Actor actor2 = new Actor();
        actor2.setId(actorId2);
        actor2.setName("Actor Two");

        Movie movie = new Movie();
        movie.setId(movieId);
        movie.setTitle("Test Movie");
        movie.setActors(new HashSet<>());  // initially empty

        List<UUID> actorIds = List.of(actorId1, actorId2);
        List<Actor> actors = List.of(actor1, actor2);

        when(movieRepository.findById(movieId)).thenReturn(Optional.of(movie));
        when(actorRepository.findAllById(actorIds)).thenReturn(actors);
        when(movieRepository.save(any(Movie.class))).thenAnswer(invocation -> invocation.getArgument(0));

        movieService.assignActorsToMovie(movieId, actorIds);

        assertEquals(2, movie.getActors().size());
        assertTrue(movie.getActors().contains(actor1));
        assertTrue(movie.getActors().contains(actor2));

        verify(movieRepository).findById(movieId);
        verify(actorRepository).findAllById(actorIds);
        verify(movieRepository).save(movie);
    }




}
