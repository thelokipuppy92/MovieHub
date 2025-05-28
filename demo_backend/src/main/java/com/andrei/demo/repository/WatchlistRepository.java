package com.andrei.demo.repository;

import com.andrei.demo.model.Movie;
import com.andrei.demo.model.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WatchlistRepository extends JpaRepository<Watchlist, UUID> {
    List<Watchlist> findByPersonId(UUID personId);
    Optional<Watchlist> findByPersonIdAndMovieId(UUID personId, UUID movieId);
    List<Watchlist> findByMovie(Movie movie);

}

