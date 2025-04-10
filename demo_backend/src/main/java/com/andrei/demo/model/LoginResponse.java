package com.andrei.demo.model;


public record LoginResponse(
        Boolean success,
        String personId,
        String role,
        String errorMessage

) {
}
