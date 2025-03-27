package com.andrei.demo.service;

import com.andrei.demo.model.Director;
import com.andrei.demo.model.DirectorCreateDTO;
import com.andrei.demo.repository.DirectorRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.Data;

@Data
@Service
@AllArgsConstructor
public class DirectorService {
    private final DirectorRepository directorRepository;

    public List<Director> getDirectors() {
        return directorRepository.findAll();
    }

    public Director addDirector(DirectorCreateDTO directorDTO) {
        Director director = new Director();
        director.setName(directorDTO.getName());
        director.setAge(directorDTO.getAge());
        director.setEmail(directorDTO.getEmail());

        return directorRepository.save(director);
    }

    public Director updateDirector(UUID uuid, DirectorCreateDTO director) {
        Director existingDirector =
                directorRepository.findById(uuid).orElseThrow(
                        () -> new IllegalStateException("Director with uuid " + uuid + " not found"));
        existingDirector.setName(director.getName());
        existingDirector.setAge(director.getAge());
        existingDirector.setEmail(director.getEmail());

        return directorRepository.save(existingDirector);
    }

    public void deleteDirector(UUID uuid) {
        directorRepository.deleteById(uuid);
    }

    public Director getDirectorByEmail(String email) {
        return directorRepository.findByEmail(email).orElseThrow(
                () -> new IllegalStateException("Director with email " + email + " not found"));
    }

    public Director getDirectorById(UUID uuid) {
        return directorRepository.findById(uuid).orElseThrow(
                () -> new IllegalStateException("Director with id " + uuid + " not found"));
    }

    public Optional<Director> findByName(String name) {
        return directorRepository.findByName(name);
    }

    public Director getOrCreateDirectorByName(String name) {
        Optional<Director> existingDirectorOpt = directorRepository.findByName(name);

        if (existingDirectorOpt.isPresent()) {
            return existingDirectorOpt.get();
        } else {
            Director newDirector = new Director();
            newDirector.setName(name);

            return directorRepository.save(newDirector);
        }
    }
}
