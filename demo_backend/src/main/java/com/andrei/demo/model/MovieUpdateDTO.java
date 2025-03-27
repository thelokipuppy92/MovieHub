package com.andrei.demo.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class MovieUpdateDTO {
    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Release year is required")
    @Min(value = 1900, message = "Release year should be after 1900")
    private Integer releaseYear;

    @NotBlank(message = "Genre is required")
    private String genre;

    @NotNull(message = "Director is required")
    private String directorId;

}
