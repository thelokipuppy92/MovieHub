package com.andrei.demo.repository;

import com.andrei.demo.model.ForgotPassword;
import com.andrei.demo.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ForgotPasswordRepository extends JpaRepository<ForgotPassword, Integer> {


    @Query("select fp from ForgotPassword fp where fp.otp = ?1 and fp.person = ?2")
    Optional<ForgotPassword> findByOtpAndPerson(Integer otp, Person person);

    ForgotPassword findByPerson(Person person);
}
