package com.backend.backend.controller;

import com.backend.backend.repository.UserRepository;
import com.backend.backend.service.JudgeService;
import com.backend.backend.service.JwtService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/question")
public class QuestionController {

    public QuestionController(
            JwtService jwtService,
            UserRepository userRepository, JudgeService judgeService) {
    }

    @PostMapping("/test")
    public boolean test(@RequestHeader("Authorization") String authHeader,
                     @RequestBody Map<String,String> b) throws IOException, InterruptedException {
        return true;

    }


}
