package com.andrei.demo.model;

import lombok.Data;

import java.util.UUID;

@Data
public class MovieResponseDTO {
    private UUID id;
    private String title;
    private Integer releaseYear;
    private String genre;
    private String directorName;
    private String directorId;
}
