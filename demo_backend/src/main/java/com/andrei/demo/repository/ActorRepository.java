package com.andrei.demo.repository;

import com.andrei.demo.model.Actor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ActorRepository extends JpaRepository<Actor, UUID> {

    Optional<Actor> findByEmail(String email);

    Optional<Actor> findByEmailAndAge(String email, Integer age);

    List<Actor> findByNameStartingWithOrNameEndingWith(String start, String end);
}
