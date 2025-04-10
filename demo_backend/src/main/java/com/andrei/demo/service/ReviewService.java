package com.andrei.demo.service;

import com.andrei.demo.model.*;
import com.andrei.demo.repository.MovieRepository;
import com.andrei.demo.repository.PersonRepository;
import com.andrei.demo.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepo;

    @Autowired
    private MovieRepository movieRepo;

    @Autowired
    private PersonRepository personRepo;

    public ReviewResponseDTO mapToResponseDTO(Review review) {
        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.setId(review.getId());
        dto.setPersonId(review.getPerson().getId());
        dto.setMovieId(review.getMovie().getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        return dto;
    }

    public Review addReview(ReviewCreateDTO reviewCreateDTO) {
        Movie movie = movieRepo.findById(reviewCreateDTO.getMovieId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));

        Person person = personRepo.findById(reviewCreateDTO.getPersonId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        reviewRepo.findByPersonAndMovie(person, movie).ifPresent(existing -> {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You already reviewed this movie.");
        });

        if (reviewCreateDTO.getRating() < 1 || reviewCreateDTO.getRating() > 10) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rating must be between 1 and 10.");
        }

        Review review = new Review(person, movie, reviewCreateDTO.getRating(), reviewCreateDTO.getComment());

        return reviewRepo.save(review);
    }

    public List<ReviewResponseDTO> getReviewsByMovie(UUID movieId) {
        Movie movie = movieRepo.findById(movieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));

        List<Review> reviews = reviewRepo.findByMovie(movie);
        return reviews.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    public List<ReviewResponseDTO> getReviewsByUser(UUID personId) {
        Person person = personRepo.findById(personId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<Review> reviews = reviewRepo.findByPerson(person);
        return reviews.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    public Review updateReview(UUID reviewId, ReviewCreateDTO reviewCreateDTO) {
        Review review = reviewRepo.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));

        if (reviewCreateDTO.getRating() < 1 || reviewCreateDTO.getRating() > 10) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rating must be between 1 and 10.");
        }

        review.setRating(reviewCreateDTO.getRating());
        review.setComment(reviewCreateDTO.getComment());

        return reviewRepo.save(review);
    }


    public void deleteReview(UUID reviewId) {
        Review review = reviewRepo.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));

        reviewRepo.delete(review);
    }


}
