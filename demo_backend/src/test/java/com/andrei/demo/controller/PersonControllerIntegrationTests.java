package com.andrei.demo.controller;

import com.andrei.demo.model.Person;
import com.andrei.demo.repository.PersonRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
public class PersonControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PersonRepository personRepository;

    private static final String FIXTURE_PATH = "src/test/resources/fixtures/";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() throws Exception {
        personRepository.deleteAll();
        personRepository.flush();
        seedDatabase();
    }

    private void seedDatabase() throws Exception {
        String seedDataJson = loadFixture("person_seed.json");
        List<Person> people = objectMapper.readValue(seedDataJson, new TypeReference<List<Person>>() {});
        personRepository.saveAll(people);
    }


    @Test
    void testGetPeople() throws Exception {
        mockMvc.perform(get("/person"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()")
                        .value(2))
                .andExpect(jsonPath("$[*].name",
                        Matchers.containsInAnyOrder("John Doe", "Jane Doe")))
                .andExpect(jsonPath("$[*].age",
                        Matchers.containsInAnyOrder(30, 25)))
                .andExpect(jsonPath("$[*].email",
                        Matchers.containsInAnyOrder(
                                "john.doe@example.com", "jane.doe@example.com"
                        )));
    }

    @Test
    void testAddPerson_ValidPayload() throws Exception {
        String validPersonJson = loadFixture("valid_person.json");

        mockMvc.perform(post("/person")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validPersonJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Alice Smith"))
                .andExpect(jsonPath("$.password").value("securepass"))
                .andExpect(jsonPath("$.age").value(28))
                .andExpect(jsonPath("$.email").value("alice.smith@example.com"));
    }

    @Test
    void testAddPerson_InvalidPayload() throws Exception {
        String invalidPersonJson = loadFixture("invalid_person.json");

        mockMvc.perform(post("/person")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidPersonJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.name")
                        .value("Name should be between 2 and 100 characters"))
                .andExpect(jsonPath("$.password")
                        .value("Password is required"))
                .andExpect(jsonPath("$.age")
                        .value("Age is required"))
                .andExpect(jsonPath("$.email")
                        .value("Email is required"));
    }

    @Test
    void testAddPerson_MissingRequiredFields() throws Exception {
        String missingNameJson = loadFixture("missing_name.json");

        mockMvc.perform(post("/person")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(missingNameJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.name").value("Name is required"));

        String missingEmailJson = loadFixture("missing_email.json");

        mockMvc.perform(post("/person")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(missingEmailJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.email").value("Email is required"));

        String missingPasswordJson = loadFixture("missing_password.json");

        mockMvc.perform(post("/person")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(missingPasswordJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.password").value("Password is required"));
    }

    @Test
    void testUpdatePerson_ValidPayload() throws Exception {
        Person person = personRepository.findAll().get(0);

        String updatedPersonJson = loadFixture("update_person.json");

        mockMvc.perform(put("/person/" + person.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedPersonJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(person.getId().toString()))
                .andExpect(jsonPath("$.name").value("Updated Name"))
                .andExpect(jsonPath("$.email").value("updated.email@example.com"))
                .andExpect(jsonPath("$.age").value(35));
    }


    @Test
    void testDeletePerson() throws Exception {
        String personJson = loadFixture("person_to_delete.json");
        Person personToDelete = objectMapper.readValue(personJson, Person.class);

        Person person = personRepository.saveAndFlush(personToDelete);
        UUID personId = person.getId();

        mockMvc.perform(delete("/person/" + personId.toString()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/person/" + personId.toString()))
                .andExpect(status().isNotFound());

        Optional<Person> deletedPerson = personRepository.findById(personId);
        assertTrue(deletedPerson.isEmpty());
    }

    /**
     * Helper method to load JSON fixture from file.
     */
    private String loadFixture(String fileName) throws IOException {
        return Files.readString(Paths.get(FIXTURE_PATH + fileName));
    }
}
