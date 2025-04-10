package com.andrei.demo.controller;

import com.andrei.demo.model.RegisterRequest;
import com.andrei.demo.service.PersonService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/register")
@CrossOrigin
public class RegisterController {

    private final PersonService personService;

    @PostMapping
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        String result = personService.register(request);
        if ("Email already in use".equals(result)) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }
}
