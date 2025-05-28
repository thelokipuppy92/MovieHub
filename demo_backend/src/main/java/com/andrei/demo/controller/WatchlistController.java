 package com.andrei.demo.controller;

import com.andrei.demo.model.Movie;
import com.andrei.demo.model.Person;
import com.andrei.demo.model.Watchlist;
import com.andrei.demo.model.WatchlistResponseDTO;
import com.andrei.demo.repository.MovieRepository;
import com.andrei.demo.repository.PersonRepository;
import com.andrei.demo.repository.WatchlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/watchlist")
@CrossOrigin
public class WatchlistController {

    @Autowired
    private PersonRepository personRepo;

    @Autowired
    private MovieRepository movieRepo;

    @Autowired
    private WatchlistRepository watchlistRepo;


    private WatchlistResponseDTO mapToDTO(Watchlist watchlist) {
        return new WatchlistResponseDTO(
                watchlist.getId(),
                watchlist.getPerson().getId(),
                watchlist.getPerson().getName(),
                watchlist.getMovie().getId(),
                watchlist.getMovie().getTitle(),
                watchlist.getAddedAt(),
                watchlist.getMovie().getReleased() != null ? watchlist.getMovie().getReleased() : false
        );
    }

    @PostMapping("/{personId}/{movieId}")
    public ResponseEntity<?> addToWatchlist(@PathVariable UUID personId, @PathVariable UUID movieId) {
        Person person = personRepo.findById(personId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Person not found"));
        Movie movie = movieRepo.findById(movieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));

        if (watchlistRepo.findByPersonIdAndMovieId(personId, movieId).isPresent()) {
            return ResponseEntity.badRequest().body("Movie already in watchlist");
        }

        Watchlist entry = new Watchlist(null, person, movie, LocalDateTime.now());
        watchlistRepo.save(entry);

        return ResponseEntity.ok(mapToDTO(entry));
    }

    @DeleteMapping("/{personId}/{movieId}")
    public ResponseEntity<?> removeFromWatchlist(@PathVariable UUID personId, @PathVariable UUID movieId) {
        Watchlist entry = watchlistRepo.findByPersonIdAndMovieId(personId, movieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Watchlist entry not found"));
        watchlistRepo.delete(entry);
        return ResponseEntity.ok("Removed from watchlist");
    }

    @GetMapping("/{personId}")
    public ResponseEntity<List<WatchlistResponseDTO>> getWatchlist(@PathVariable UUID personId) {
        List<Watchlist> watchlistEntries = watchlistRepo.findByPersonId(personId);
        List<WatchlistResponseDTO> response = watchlistEntries.stream()
                .map(this::mapToDTO)
                .toList();
        return ResponseEntity.ok(response);
    }
}
