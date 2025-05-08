package com.andrei.demo.service;

import com.andrei.demo.model.Actor;
import com.andrei.demo.model.ActorCreateDTO;
import com.andrei.demo.repository.ActorRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ActorService {
    private final ActorRepository actorRepository;

    //stream to map actors to DTOs
    public List<ActorCreateDTO> getActors() {
        return actorRepository.findAll().stream()
                .map(actor -> {
                    ActorCreateDTO actorDTO = new ActorCreateDTO();
                    actorDTO.setEmail(actor.getEmail());
                    actorDTO.setName(actor.getName());
                    actorDTO.setAge(actor.getAge());
                    actorDTO.setId(actor.getId());
                    return actorDTO;
                })
                .collect(Collectors.toList());
    }

    public Actor addActor(ActorCreateDTO actorDTO) {
        Actor actor = new Actor();
        actor.setName(actorDTO.getName());
        actor.setAge(actorDTO.getAge());
        actor.setEmail(actorDTO.getEmail());
        return actorRepository.save(actor);
    }

    //update actor with map functionality
    public Actor updateActor(UUID uuid, ActorCreateDTO actorDTO) {
        return actorRepository.findById(uuid)
                .map(existingActor -> {
                    existingActor.setName(actorDTO.getName());
                    existingActor.setAge(actorDTO.getAge());
                    existingActor.setEmail(actorDTO.getEmail());
                    return actorRepository.save(existingActor);
                })
                .orElseThrow(() -> new IllegalStateException("Actor with uuid " + uuid + " not found"));
    }

    //delete actor using ifPresentOrElse
    public void deleteActor(UUID uuid) {
        actorRepository.findById(uuid)
                .ifPresentOrElse(actorRepository::delete,
                        () -> { throw new IllegalStateException("Actor with id " + uuid + " not found"); });
    }

    //get actor by email with orElseThrow for exception handling
    public Actor getActorByEmail(String email) {
        return actorRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Actor with email " + email + " not found"));
    }

    //get actor by ID with orElseThrow for exception handling
    public Actor getActorById(UUID uuid) {
        return actorRepository.findById(uuid)
                .orElseThrow(() -> new IllegalStateException("Actor with id " + uuid + " not found"));
    }
}
