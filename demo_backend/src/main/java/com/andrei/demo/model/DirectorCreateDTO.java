package com.andrei.demo.model;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.UUID;


@Getter
@Setter
@Data
public class DirectorCreateDTO {
    private UUID id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name should be between 2 and 100 characters")
    private String name;

    @Min(value = 0, message = "Age must be a positive number")
    @NotNull(message = "Age is required")
    private Integer age;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    private String email;


}
