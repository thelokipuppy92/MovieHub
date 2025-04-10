package com.andrei.demo.service;

import com.andrei.demo.config.ValidationException;
import com.andrei.demo.model.Actor;
import com.andrei.demo.model.ActorCreateDTO;
import com.andrei.demo.repository.ActorRepository;
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

class ActorServiceTests {

    @Mock
    private ActorRepository actorRepository;

    @InjectMocks
    private ActorService actorService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetActors() {
        // given:
        Actor actor1 = new Actor();
        actor1.setId(UUID.randomUUID());
        actor1.setName("John");
        actor1.setAge(30);
        actor1.setEmail("john@example.com");

        Actor actor2 = new Actor();
        actor2.setId(UUID.randomUUID());
        actor2.setName("Jane");
        actor2.setAge(28);
        actor2.setEmail("jane@example.com");

        List<Actor> actors = List.of(actor1, actor2);

        // when:
        when(actorRepository.findAll()).thenReturn(actors);
        List<ActorCreateDTO> result = actorService.getActors();

        // then:
        assertEquals(2, result.size());

        ActorCreateDTO result1 = result.get(0);
        assertEquals("John", result1.getName());
        assertEquals(30, result1.getAge());
        assertEquals("john@example.com", result1.getEmail());

        ActorCreateDTO result2 = result.get(1);
        assertEquals("Jane", result2.getName());
        assertEquals(28, result2.getAge());
        assertEquals("jane@example.com", result2.getEmail());

        verify(actorRepository, times(1)).findAll();
    }


    @Test
    void testAddActor() {
        // given:
        ActorCreateDTO actorDTO = new ActorCreateDTO();
        actorDTO.setName("John");
        actorDTO.setAge(30);
        actorDTO.setEmail("john@example.com");

        Actor actorToSave = new Actor();
        actorToSave.setName("John");
        actorToSave.setAge(30);
        actorToSave.setEmail("john@example.com");

        Actor savedActor = new Actor();
        savedActor.setId(UUID.randomUUID());
        savedActor.setName("John");
        savedActor.setAge(30);
        savedActor.setEmail("john@example.com");

        // when:
        when(actorRepository.save(any(Actor.class))).thenReturn(savedActor);
        Actor result = actorService.addActor(actorDTO);

        // then:
        assertEquals(savedActor, result);
        assertNotNull(result.getId());
        verify(actorRepository, times(1)).save(any());
    }

    @Test
    void testUpdateActor() throws ValidationException {
        // given:
        UUID uuid = UUID.randomUUID();
        Actor existingActor = new Actor();
        existingActor.setId(uuid);
        existingActor.setName("John");
        existingActor.setAge(30);
        existingActor.setEmail("john@example.com");

        ActorCreateDTO updatedActorDTO = new ActorCreateDTO();
        updatedActorDTO.setId(uuid);
        updatedActorDTO.setName("Jane");
        updatedActorDTO.setAge(25);
        updatedActorDTO.setEmail("jane@example.com");

        Actor updatedActor = new Actor();
        updatedActor.setId(uuid);
        updatedActor.setName("Jane");
        updatedActor.setAge(25);
        updatedActor.setEmail("jane@example.com");

        // when:
        when(actorRepository.findById(uuid)).thenReturn(Optional.of(existingActor));
        when(actorRepository.save(any(Actor.class))).thenReturn(updatedActor); // ✅ return correct type

        // Call service
        Actor result = actorService.updateActor(uuid, updatedActorDTO);

        // then:
        assertEquals("Jane", result.getName());
        assertEquals(25, result.getAge());
        assertEquals("jane@example.com", result.getEmail());

        verify(actorRepository, times(1)).findById(uuid);
        verify(actorRepository).save(any(Actor.class));
    }


    @Test
    void testUpdateActorNotFound() {
        // given:
        UUID uuid = UUID.randomUUID();
        ActorCreateDTO actor = new ActorCreateDTO();

        // when:
        when(actorRepository.findById(uuid)).thenReturn(Optional.empty());

        // then:
        assertThrows(IllegalStateException.class, () -> actorService.updateActor(uuid, actor));
        verify(actorRepository, times(1)).findById(uuid);
    }

    @Test
    void testDeleteActor() {
        // given:
        UUID uuid = UUID.randomUUID();

        // when:
        doNothing().when(actorRepository).deleteById(uuid);
        actorService.deleteActor(uuid);

        // then:
        verify(actorRepository, times(1)).deleteById(uuid);
    }
}
