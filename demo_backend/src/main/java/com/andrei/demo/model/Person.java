package com.andrei.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "person")
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    private Integer age;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    public Person(String name, String email, Integer age, String password) {
        this.name = name;
        this.email = email;
        this.age = age;
        this.password = password;
    }

    public Person(Person person) {
        this.id = person.getId();
        this.name = person.getName();
        this.password = person.getPassword();
        this.age = person.getAge();
        this.email = person.getEmail();
    }

    /*
    @OneToOne(mappedBy = "person")
    private  ForgotPassword forgotPassword;

     */

    public String getRole() {
        if (this.email.equals("admin@example.com")) {
            return "ADMIN";
        } else {
            return "USER";
        }
    }

}
