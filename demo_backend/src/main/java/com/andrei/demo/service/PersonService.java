package com.andrei.demo.service;

import com.andrei.demo.config.ValidationException;
import com.andrei.demo.model.LoginResponse;
import com.andrei.demo.model.Person;
import com.andrei.demo.model.PersonCreateDTO;
import com.andrei.demo.model.RegisterRequest;
import com.andrei.demo.repository.PersonRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.Data;

@Data
@Service
@AllArgsConstructor
public class PersonService {
    private final PersonRepository personRepository;

    public List<Person> getPeople() {
        return personRepository.findAll();
    }

    public Person addPerson(PersonCreateDTO personDTO) {
        Person person = new Person();
        person.setName(personDTO.getName());
        person.setAge(personDTO.getAge());
        person.setEmail(personDTO.getEmail());
        person.setPassword(personDTO.getPassword());

        return personRepository.save(person);
    }

    public Person updatePerson(UUID uuid, Person person) {
        Person existingPerson =
                personRepository.findById(uuid).orElseThrow(() -> new ValidationException("Person with uuid " + uuid + " not found"));

        existingPerson.setName(person.getName());
        existingPerson.setAge(person.getAge());
        existingPerson.setEmail(person.getEmail());

        return personRepository.save(existingPerson);
    }

    public void deletePerson(UUID uuid) {
        personRepository.deleteById(uuid);
    }

    public Person getPersonByEmail(String email) {
        return personRepository.findByEmail(email).orElseThrow(
                () -> new IllegalStateException("Person with email " + email + " not found"));
    }

    public Person getPersonById(UUID uuid) {
        return personRepository.findById(uuid).orElseThrow(
                () -> new IllegalStateException("Person with id " + uuid + " not found"));
    }


    public LoginResponse login(String email, String password) {
        Optional<Person> maybePerson = personRepository.findByEmail(email);

        if (maybePerson.isEmpty()) {
            return new LoginResponse(
                    false,
                    null,
                    null,
                    "Person with email " + email + " not found"
            );
        }

        Person person = maybePerson.get();

        if ("admin@example.com".equals(email) && "admin".equals(password)) {
            return new LoginResponse(true, "3e339045-a420-49d2-9056-857a97b33a89", "ADMIN", null);
        }

        if (person.getPassword().equals(password)) {
            return new LoginResponse(true, person.getId().toString(), "USER", null);
        } else {
            return new LoginResponse(false, null, null, "Incorrect password");
        }
    }


    public String register(RegisterRequest request) {
        if (personRepository.findByEmail(request.email()).isPresent()) {
            return "Email already in use";
        }

        Person person = new Person(request.name(), request.email(), request.age(), request.password());
        personRepository.save(person);

        return "Registration successful";
    }
}
