package com.andrei.demo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Set;
import java.util.UUID;

@Entity
@Data
@Table(name = "actor")
public class Actor {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    private Integer age;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    /*
    // Many-to-Many: An actor can act in multiple movies
    @ManyToMany(mappedBy = "actors")
    @JsonManagedReference
    private Set<Movie> movies;
 */
    @Override
    public String toString() {
        return "Actor{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", email='" + email + '\'' +
               // ", movies=" + movies +
                '}';
    }
}
