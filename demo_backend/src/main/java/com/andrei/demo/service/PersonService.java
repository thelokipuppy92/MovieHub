package com.andrei.demo.service;

import com.andrei.demo.config.ValidationException;
import com.andrei.demo.model.*;
import com.andrei.demo.repository.PersonRepository;
import com.andrei.demo.util.JwtUtil;
import com.andrei.demo.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PersonService {

    private final PasswordUtil passwordUtil;
    private final JwtUtil jwtUtil;
    private final PersonRepository personRepository;

    public List<Person> getPeople() {
        return personRepository.findAll();
    }

    public Person addPerson(PersonCreateDTO personDTO) {
        String hashedPassword = passwordUtil.hashPassword(personDTO.getPassword());
        Person person = new Person(personDTO.getName(), personDTO.getEmail(),personDTO.getAge(), hashedPassword);
        return personRepository.save(person);
    }

    public Person updatePerson(UUID uuid, Person person) throws ValidationException {
        Person existingPerson = personRepository.findById(uuid)
                .orElseThrow(() -> new ValidationException("Person with id " + uuid + " not found"));

        existingPerson.setName(person.getName());
        existingPerson.setAge(person.getAge());
        existingPerson.setEmail(person.getEmail());
        existingPerson.setPassword(passwordUtil.hashPassword(person.getPassword()));

        return personRepository.save(existingPerson);
    }

    public void deletePerson(UUID uuid) {
        personRepository.deleteById(uuid);
    }

    public Person getPersonByEmail(String email) {
        return personRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Person with email " + email + " not found"));
    }

    public Person getPersonById(UUID uuid) {
        return personRepository.findById(uuid)
                .orElseThrow(() -> new IllegalStateException("Person with id " + uuid + " not found"));
    }

    /*
    // Login method
    public LoginResponse login(String email, String password) {
        Person person = personRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Person with email " + email + " not found"));

        if (passwordUtil.checkPassword(password, person.getPassword())) {
            String role = email.equals("admin@example.com") ? "ADMIN" : "USER";
            String token = jwtUtil.createToken(person);
            return new LoginResponse(true, person.getId().toString(), role, token);
        } else {
            return new LoginResponse("Incorrect password");
        }
    }

     */
    public LoginResponse login(String email, String password) {
        Person person = personRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Person with email " + email + " not found"));

        if (passwordUtil.checkPassword(password, person.getPassword())) {
            String role = person.getRole();
            String token = jwtUtil.createToken(person, role);
            return new LoginResponse(true, person.getId().toString(), role, token);
        } else {
            return new LoginResponse("Incorrect password");
        }
    }


    public String register(RegisterRequest request) {
        // Check if email is already taken
        if (personRepository.findByEmail(request.email()).isPresent()) {
            return "Email already in use";
        }

        String hashedPassword = passwordUtil.hashPassword(request.password());

        Person person = new Person(request.name(), request.email(), request.age(), hashedPassword);
        personRepository.save(person);

        return "Registration successful";
    }
}
