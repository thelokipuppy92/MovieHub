package com.andrei.demo.service;

import com.andrei.demo.model.Actor;
import com.andrei.demo.model.ActorCreateDTO;  // You should create this DTO similar to DirectorCreateDTO
import com.andrei.demo.repository.ActorRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ActorService {
    private final ActorRepository actorRepository;

    public List<ActorCreateDTO> getActors() {
        List<Actor> actors = actorRepository.findAll();
        List<ActorCreateDTO> actorsDTO = new ArrayList<>();
        for (Actor actor : actors) {
            ActorCreateDTO actorDTO = new ActorCreateDTO();
            actorDTO.setEmail(actor.getEmail());
            actorDTO.setName(actor.getName());
            actorDTO.setAge(actor.getAge());
            actorDTO.setId(actor.getId());
            actorsDTO.add(actorDTO);
        }
        return actorsDTO;
    }

    public Actor addActor(ActorCreateDTO actorDTO) {
        Actor actor = new Actor();
        actor.setName(actorDTO.getName());
        actor.setAge(actorDTO.getAge());
        actor.setEmail(actorDTO.getEmail());

        return actorRepository.save(actor);
    }

    public Actor updateActor(UUID uuid, ActorCreateDTO actor) {
        Actor existingActor =
                actorRepository.findById(uuid).orElseThrow(
                        () -> new IllegalStateException("Actor with uuid " + uuid + " not found"));
        existingActor.setName(actor.getName());
        existingActor.setAge(actor.getAge());
        existingActor.setEmail(actor.getEmail());

        return actorRepository.save(existingActor);
    }

    public void deleteActor(UUID uuid) {
        actorRepository.deleteById(uuid);
    }

    public Actor getActorByEmail(String email) {
        return actorRepository.findByEmail(email).orElseThrow(
                () -> new IllegalStateException("Actor with email " + email + " not found"));
    }

    public Actor getActorById(UUID uuid) {
        return actorRepository.findById(uuid).orElseThrow(
                () -> new IllegalStateException("Actor with id " + uuid + " not found"));
    }
}
