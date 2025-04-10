package com.andrei.demo.model;

import lombok.Data;

import java.util.UUID;

@Data
public class ReviewResponseDTO {

    private UUID id;
    private UUID personId;
    private UUID movieId;
    private Integer rating;
    private String comment;


}
