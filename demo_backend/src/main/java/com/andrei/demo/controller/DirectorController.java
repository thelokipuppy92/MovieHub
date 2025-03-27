package com.andrei.demo.controller;

import com.andrei.demo.model.DirectorCreateDTO;
import com.andrei.demo.service.DirectorService;
import com.andrei.demo.model.Director;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@CrossOrigin
@RequestMapping("/directors")
public class DirectorController {

    private final DirectorService directorService;

    @GetMapping
    public List<Director> getDirectors() {
        return directorService.getDirectors();
    }

    @GetMapping("/{uuid}")
    public Director getDirectorById(@PathVariable UUID uuid) {
        return directorService.getDirectorById(uuid);
    }

    @GetMapping("/name/{name}")
    public Director getDirectorByNameOrCreate(@PathVariable String name) {
        return directorService.getOrCreateDirectorByName(name);
    }

    @GetMapping("/email/{email}")
    public Director getDirectorByEmail(@PathVariable String email) {
        return directorService.getDirectorByEmail(email);
    }

    @PostMapping
    public Director addDirector(@Valid @RequestBody DirectorCreateDTO directorDTO) {
        return directorService.addDirector(directorDTO);
    }

    @PutMapping("/{uuid}")
    public Director updateDirector(@PathVariable UUID uuid, @RequestBody DirectorCreateDTO director) {
        return directorService.updateDirector(uuid, director);
    }

    @DeleteMapping("/{uuid}")
    public void deleteDirector(@PathVariable UUID uuid) {
        directorService.deleteDirector(uuid);
    }
}
