package com.andrei.demo.repository;

import com.andrei.demo.model.Movie;
import com.andrei.demo.model.Person;
import com.andrei.demo.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Optional<Review> findByPersonAndMovie(Person person, Movie movie);

    List<Review> findByMovie(Movie movie);

    List<Review> findByPerson(Person person);

    Optional<Review> findById(UUID reviewId);
}
