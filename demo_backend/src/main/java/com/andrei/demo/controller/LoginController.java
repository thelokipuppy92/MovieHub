package com.andrei.demo.controller;


import com.andrei.demo.model.LoginRequest;
import com.andrei.demo.model.LoginResponse;
import com.andrei.demo.service.PersonService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@AllArgsConstructor
@CrossOrigin
public class LoginController {
    private final PersonService personService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse loginResponse = personService.login(loginRequest.email(), loginRequest.password());
        if(loginResponse.success()) {
            return ResponseEntity.ok(loginResponse);
        } else {
            return ResponseEntity.status(UNAUTHORIZED.value()).body(loginResponse);
        }
    }
}

