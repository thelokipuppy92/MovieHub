package com.andrei.demo.controller;

import com.andrei.demo.model.Person;
import com.andrei.demo.model.Review;
import com.andrei.demo.model.ReviewCreateDTO;
import com.andrei.demo.model.ReviewResponseDTO;
import com.andrei.demo.service.ReviewService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping("/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody @Valid ReviewCreateDTO dto) {
        Review saved = reviewService.addReview(dto);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{movieId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByMovieId(@PathVariable UUID movieId) {
        List<ReviewResponseDTO> reviews = reviewService.getReviewsByMovie(movieId);
        return ResponseEntity.ok(reviews);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<Review> updateReview(@PathVariable UUID reviewId, @RequestBody @Valid ReviewCreateDTO reviewCreateDTO) {
        Review updatedReview = reviewService.updateReview(reviewId, reviewCreateDTO);
        return ResponseEntity.ok(updatedReview);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable UUID reviewId) {
        try {
            reviewService.deleteReview(reviewId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
