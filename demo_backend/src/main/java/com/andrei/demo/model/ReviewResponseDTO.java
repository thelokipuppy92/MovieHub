package com.andrei.demo.model;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;
@Builder
@Data
public class ReviewResponseDTO {

    private UUID id;
    private UUID personId;
    private UUID movieId;
    private Integer rating;
    private String comment;


}
