package com.andrei.demo.controller;  // or any package for controllers

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
public class ImageController {

    private final Path imagesDir = Paths.get("src/main/resources/images");

    @GetMapping("/api/images")
    public ResponseEntity<List<String>> listImages() throws IOException {
        if (!Files.exists(imagesDir)) {
            return ResponseEntity.ok(List.of());
        }
        List<String> filenames = Files.list(imagesDir)
                .filter(Files::isRegularFile)
                .map(imagesDir::relativize)
                .map(Path::toString)
                .collect(Collectors.toList());

        return ResponseEntity.ok(filenames);
    }
}
