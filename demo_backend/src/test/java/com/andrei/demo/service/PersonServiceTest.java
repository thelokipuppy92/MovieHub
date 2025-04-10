package com.andrei.demo.service;

import com.andrei.demo.config.ValidationException;
import com.andrei.demo.model.LoginResponse;
import com.andrei.demo.model.Person;
import com.andrei.demo.model.PersonCreateDTO;
import com.andrei.demo.repository.PersonRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PersonServiceTests {

    @Mock
    private PersonRepository personRepository;

    @InjectMocks
    private PersonService personService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetPeople() {
        // given:
        List<Person> people = List.of(new Person(), new Person());

        // when:
        when(personRepository.findAll()).thenReturn(people);
        List<Person> result = personService.getPeople();

        // then:
        assertEquals(2, result.size());
        verify(personRepository, times(1)).findAll();
        assertEquals(people, result);
    }

    @Test
    void testAddPerson() {
        // given:
        PersonCreateDTO personDTO =
                new PersonCreateDTO("John", 30, "john@example.com","password");
        Person personToSave = new Person();
        personToSave.setName("John");
        personToSave.setAge(30);
        personToSave.setEmail("john@example.com");
        personToSave.setPassword("password");

        Person savedPerson = new Person(personToSave);
        savedPerson.setId(UUID.randomUUID());

        // when:
        when(personRepository.save(any(Person.class))).thenReturn(savedPerson);
        Person result = personService.addPerson(personDTO);

        // then:
        assertEquals(savedPerson, result);
        assertNotNull(result.getId());
        verify(personRepository, times(1)).save(any());
    }

    @Test
    void testUpdatePerson() throws ValidationException {
        // given:
        UUID uuid = UUID.randomUUID();
        Person person = new Person();
        person.setId(uuid);
        person.setName("John");
        person.setAge(30);
        person.setEmail("john@example.com");
        person.setPassword("password");

        Person updatedPerson = new Person();
        updatedPerson.setId(uuid);
        updatedPerson.setName("Jane");
        updatedPerson.setAge(25);
        updatedPerson.setEmail("jane@example.com");
        updatedPerson.setPassword("newpassword");

        // when:
        when(personRepository.findById(uuid)).thenReturn(Optional.of(person));
        when(personRepository.save(any())).thenReturn(updatedPerson);
        Person result = personService.updatePerson(uuid, updatedPerson);

        // then:
        assertEquals("Jane", result.getName());
        verify(personRepository, times(1)).findById(uuid);
        verify(personRepository).save(any(Person.class));

    }

    @Test
    void testUpdatePersonNotFound() {
        // given:
        UUID uuid = UUID.randomUUID();
        Person person = new Person();

        // when:
        when(personRepository.findById(uuid)).thenReturn(Optional.empty());

        // then:
        assertThrows(ValidationException.class, () -> personService.updatePerson(uuid, person));
        verify(personRepository, times(1)).findById(uuid);
    }

    @Test
    void testDeletePerson() {
        // given:
        UUID uuid = UUID.randomUUID();

        // when:
        doNothing().when(personRepository).deleteById(uuid);
        personService.deletePerson(uuid);

        // then:
        verify(personRepository, times(1)).deleteById(uuid);
    }


    @Test
    void testLoginSuccess() {
        String email = "admin@example.com";
        String password = "admin";

        Person person = new Person();
        person.setId(UUID.randomUUID());
        person.setEmail(email);
        person.setPassword(password);

        when(personRepository.findByEmail(email)).thenReturn(Optional.of(person));

        LoginResponse result = personService.login(email, password);

        assertTrue(result.success());
        assertEquals("3e339045-a420-49d2-9056-857a97b33a89", result.personId());
        assertEquals("ADMIN", result.role());

        verify(personRepository, times(1)).findByEmail(email);
    }


    @Test
    void testLoginIncorrectPassword() {
        String email = "john@example.com";
        String password = "password";
        Person person = new Person();
        person.setEmail(email);
        person.setPassword("wrongpassword");

        when(personRepository.findByEmail(email)).thenReturn(Optional.of(person));
        LoginResponse result = personService.login(email, password);

        assertFalse(result.success());
        assertEquals("Incorrect password", result.errorMessage());
        verify(personRepository, times(1)).findByEmail(email);
    }


    @Test
    void testLoginEmailNotFound() {
        String email = "john@example.com";
        String password = "password";

        when(personRepository.findByEmail(email)).thenReturn(Optional.empty());
        LoginResponse result = personService.login(email, password);

        assertFalse(result.success());
        assertEquals("Person with email " + email + " not found", result.errorMessage());
        verify(personRepository, times(1)).findByEmail(email);
    }
}
