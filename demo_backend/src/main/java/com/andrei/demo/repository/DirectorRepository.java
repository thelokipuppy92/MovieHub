package com.andrei.demo.repository;

import com.andrei.demo.model.Director;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DirectorRepository extends JpaRepository<Director, UUID> {

    Optional<Director> findByName(String directorName);

    Optional<Director> findByEmail(String email);

}
