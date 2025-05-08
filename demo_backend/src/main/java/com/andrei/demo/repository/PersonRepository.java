package com.andrei.demo.repository;

import com.andrei.demo.model.Person;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PersonRepository extends JpaRepository<Person, UUID> {
    Optional<Person> findByEmail(String email);

    @Transactional
    @Modifying
    @Query("update Person p set p.password = ?2 where p.email = ?1")
    void updatePassword(String email, String password);

}
