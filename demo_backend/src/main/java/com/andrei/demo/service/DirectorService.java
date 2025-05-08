package com.andrei.demo.service;

import com.andrei.demo.model.Director;
import com.andrei.demo.model.DirectorCreateDTO;
import com.andrei.demo.repository.DirectorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
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

    public Director updateDirector(UUID uuid, DirectorCreateDTO directorDTO) {
        return directorRepository.findById(uuid)
                .map(existingDirector -> {
                    existingDirector.setName(directorDTO.getName());
                    existingDirector.setAge(directorDTO.getAge());
                    existingDirector.setEmail(directorDTO.getEmail());
                    return directorRepository.save(existingDirector);
                })
                .orElseThrow(() -> new IllegalStateException("Director with uuid " + uuid + " not found"));
    }

    public void deleteDirector(UUID uuid) {
        directorRepository.findById(uuid)
                .ifPresentOrElse(directorRepository::delete,
                        () -> { throw new IllegalStateException("Director with id " + uuid + " not found"); });
    }

    public Director getDirectorByEmail(String email) {
        return directorRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Director with email " + email + " not found"));
    }


    public Director getDirectorById(UUID uuid) {
        return directorRepository.findById(uuid)
                .orElseThrow(() -> new IllegalStateException("Director with id " + uuid + " not found"));
    }

    public Optional<Director> findByName(String name) {
        return directorRepository.findByName(name);
    }

    public Director getOrCreateDirectorByName(String name) {
        return directorRepository.findByName(name)
                .orElseGet(() -> {
                    Director newDirector = new Director();
                    newDirector.setName(name);
                    return directorRepository.save(newDirector);
                });
    }

}
