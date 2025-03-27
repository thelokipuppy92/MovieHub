package com.andrei.demo.repository;

import com.andrei.demo.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface MovieRepository extends JpaRepository<Movie, UUID> {

    List<Movie> findByGenre(String genre);

    List<Movie> findByDirectorId(UUID directorId);

    List<Movie> findByActors_Id(UUID actorId);
}
