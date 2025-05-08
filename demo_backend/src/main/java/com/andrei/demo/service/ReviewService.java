package com.andrei.demo.service;

import com.andrei.demo.model.*;
import com.andrei.demo.repository.MovieRepository;
import com.andrei.demo.repository.PersonRepository;
import com.andrei.demo.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepo;
    private final MovieRepository movieRepo;
    private final PersonRepository personRepo;

    private final Function<Review, ReviewResponseDTO> toDto = review -> ReviewResponseDTO.builder()
            .id(review.getId())
            .personId(review.getPerson().getId())
            .movieId(review.getMovie().getId())
            .rating(review.getRating())
            .comment(review.getComment())
            .build();

    public Review addReview(ReviewCreateDTO dto) {
        Movie movie = movieRepo.findById(dto.getMovieId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));

        Person person = personRepo.findById(dto.getPersonId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        reviewRepo.findByPersonAndMovie(person, movie)
                .ifPresent(existing -> {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You already reviewed this movie.");
                });

        validateRating(dto.getRating());

        return reviewRepo.save(new Review(person, movie, dto.getRating(), dto.getComment()));
    }

    public List<ReviewResponseDTO> getReviewsByMovie(UUID movieId) {
        return movieRepo.findById(movieId)
                .map(reviewRepo::findByMovie)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"))
                .stream()
                .map(toDto)
                .collect(Collectors.toList());
    }

    public List<ReviewResponseDTO> getReviewsByUser(UUID personId) {
        return personRepo.findById(personId)
                .map(reviewRepo::findByPerson)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"))
                .stream()
                .map(toDto)
                .collect(Collectors.toList());
    }

    public Review updateReview(UUID reviewId, ReviewCreateDTO dto) {
        validateRating(dto.getRating());

        return reviewRepo.findById(reviewId)
                .map(existing -> {
                    existing.setRating(dto.getRating());
                    existing.setComment(dto.getComment());
                    return reviewRepo.save(existing);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));
    }

    public void deleteReview(UUID reviewId) {
        reviewRepo.findById(reviewId)
                .ifPresentOrElse(reviewRepo::delete, () -> {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found");
                });
    }

    private void validateRating(int rating) {
        if (rating < 1 || rating > 10) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rating must be between 1 and 10.");
        }
    }
}
