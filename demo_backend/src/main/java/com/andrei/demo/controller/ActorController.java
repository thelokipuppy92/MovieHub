package com.andrei.demo.controller;

import com.andrei.demo.model.ActorCreateDTO;  // This is similar to DirectorCreateDTO
import com.andrei.demo.model.Actor;
import com.andrei.demo.service.ActorService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@CrossOrigin
@RequestMapping("/actors")
public class ActorController {

    private final ActorService actorService;

    @GetMapping
    public List<ActorCreateDTO> getActors() {
        return actorService.getActors();
    }

    @GetMapping("/{uuid}")
    public Actor getActorById(@PathVariable UUID uuid) {
        return actorService.getActorById(uuid);
    }

    @GetMapping("/email/{email}")
    public Actor getActorByEmail(@PathVariable String email) {
        return actorService.getActorByEmail(email);
    }

    @PostMapping
    public Actor addActor(@Valid @RequestBody ActorCreateDTO actorDTO) {
        return actorService.addActor(actorDTO);
    }

    @PutMapping("/{uuid}")
    public Actor updateActor(@PathVariable UUID uuid, @RequestBody ActorCreateDTO actor) {
        return actorService.updateActor(uuid, actor);
    }

    @DeleteMapping("/{uuid}")
    public void deleteActor(@PathVariable UUID uuid) {
        actorService.deleteActor(uuid);
    }
}
