package com.andrei.demo.model;

public record RegisterRequest(
        String name,
        String email,
        int age,
        String password
) {
}
