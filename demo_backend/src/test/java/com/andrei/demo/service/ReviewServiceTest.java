package com.andrei.demo.service;

import com.andrei.demo.model.*;
import com.andrei.demo.repository.MovieRepository;
import com.andrei.demo.repository.PersonRepository;
import com.andrei.demo.repository.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReviewServiceTests {

    @Mock
    private ReviewRepository reviewRepo;

    @Mock
    private MovieRepository movieRepo;

    @Mock
    private PersonRepository personRepo;

    @InjectMocks
    private ReviewService reviewService;

    private UUID personId;
    private UUID movieId;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        personId = UUID.randomUUID();
        movieId = UUID.randomUUID();
    }

    @Test
    void testAddReviewSuccess() {
        Person person = new Person();
        person.setId(personId);

        Movie movie = new Movie();
        movie.setId(movieId);

        ReviewCreateDTO dto = new ReviewCreateDTO(null, movieId, "Great movie", 8, personId);

        when(movieRepo.findById(movieId)).thenReturn(Optional.of(movie));
        when(personRepo.findById(personId)).thenReturn(Optional.of(person));
        when(reviewRepo.findByPersonAndMovie(person, movie)).thenReturn(Optional.empty());

        Review savedReview = new Review(person, movie, 8, "Great movie");
        savedReview.setId(UUID.randomUUID());

        when(reviewRepo.save(any(Review.class))).thenReturn(savedReview);

        Review result = reviewService.addReview(dto);

        assertEquals("Great movie", result.getComment());
        assertEquals(8, result.getRating());
        verify(reviewRepo).save(any(Review.class));
    }

    @Test
    void testAddReviewMovieNotFound() {
        ReviewCreateDTO dto = new ReviewCreateDTO(null, movieId, "Comment", 7, personId);
        when(movieRepo.findById(movieId)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> reviewService.addReview(dto));
    }

    @Test
    void testAddReviewPersonNotFound() {
        Movie movie = new Movie();
        when(movieRepo.findById(movieId)).thenReturn(Optional.of(movie));
        when(personRepo.findById(personId)).thenReturn(Optional.empty());

        ReviewCreateDTO dto = new ReviewCreateDTO(null, movieId, "Nice", 6, personId);
        assertThrows(ResponseStatusException.class, () -> reviewService.addReview(dto));
    }

    @Test
    void testAddReviewAlreadyExists() {
        Movie movie = new Movie();
        Person person = new Person();

        when(movieRepo.findById(movieId)).thenReturn(Optional.of(movie));
        when(personRepo.findById(personId)).thenReturn(Optional.of(person));
        when(reviewRepo.findByPersonAndMovie(person, movie)).thenReturn(Optional.of(new Review()));

        ReviewCreateDTO dto = new ReviewCreateDTO(null, movieId, "Duplicate", 5, personId);
        assertThrows(ResponseStatusException.class, () -> reviewService.addReview(dto));
    }

    @Test
    void testGetReviewsByMovie() {
        Movie movie = new Movie();
        movie.setId(movieId);

        Review review = new Review();
        review.setMovie(movie);
        review.setPerson(new Person(UUID.randomUUID(), "User", 25, "email", "pass"));
        review.setRating(7);
        review.setComment("Nice");

        when(movieRepo.findById(movieId)).thenReturn(Optional.of(movie));
        when(reviewRepo.findByMovie(movie)).thenReturn(List.of(review));

        List<ReviewResponseDTO> reviews = reviewService.getReviewsByMovie(movieId);
        assertEquals(1, reviews.size());
        assertEquals("Nice", reviews.get(0).getComment());
    }

    @Test
    void testGetReviewsByUser() {
        Person person = new Person();
        person.setId(personId);

        Movie movie = new Movie();
        movie.setId(UUID.randomUUID());
        movie.setTitle("Movie");
        movie.setReleaseYear(2023);

        Review review = new Review();
        review.setMovie(movie);
        review.setPerson(person);
        review.setRating(9);
        review.setComment("Awesome!");

        when(personRepo.findById(personId)).thenReturn(Optional.of(person));
        when(reviewRepo.findByPerson(person)).thenReturn(List.of(review));

        List<ReviewResponseDTO> reviews = reviewService.getReviewsByUser(personId);
        assertEquals(1, reviews.size());
        assertEquals("Awesome!", reviews.get(0).getComment());
    }


    @Test
    void testUpdateReviewSuccess() {
        UUID reviewId = UUID.randomUUID();
        Review existing = new Review();
        existing.setId(reviewId);
        existing.setRating(4);
        existing.setComment("Old comment");

        ReviewCreateDTO dto = new ReviewCreateDTO(reviewId, movieId, "Updated comment", 9, personId);

        when(reviewRepo.findById(reviewId)).thenReturn(Optional.of(existing));
        when(reviewRepo.save(any())).thenReturn(existing);

        Review result = reviewService.updateReview(reviewId, dto);
        assertEquals("Updated comment", result.getComment());
        assertEquals(9, result.getRating());
        verify(reviewRepo).save(existing);
    }

    @Test
    void testUpdateReviewNotFound() {
        UUID reviewId = UUID.randomUUID();
        when(reviewRepo.findById(reviewId)).thenReturn(Optional.empty());

        ReviewCreateDTO dto = new ReviewCreateDTO(reviewId, movieId, "Comment", 7, personId);
        assertThrows(ResponseStatusException.class, () -> reviewService.updateReview(reviewId, dto));
    }

    @Test
    void testDeleteReviewSuccess() {
        UUID reviewId = UUID.randomUUID();
        Review review = new Review();
        review.setId(reviewId);

        when(reviewRepo.findById(reviewId)).thenReturn(Optional.of(review));
        doNothing().when(reviewRepo).delete(review);

        reviewService.deleteReview(reviewId);

        verify(reviewRepo).delete(review);
    }

    @Test
    void testDeleteReviewNotFound() {
        UUID reviewId = UUID.randomUUID();
        when(reviewRepo.findById(reviewId)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> reviewService.deleteReview(reviewId));
    }
}
