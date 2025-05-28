package com.andrei.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Data
public class MovieResponseDTO {
    private UUID id;
    private String title;
    private Integer releaseYear;
    private String genre;
    private String directorName;
    private String directorId;
    private String imageUrl;
    private String description;
    private Boolean released=false;

}
