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
@RequestMapping("/api/judge")
public class JudgeController {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final JudgeService judgeService;


    public JudgeController(
            JwtService jwtService,
            UserRepository userRepository, JudgeService judgeService) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.judgeService = judgeService;
    }

    @PostMapping("/submit")
    public ResponseEntity<?> end(@RequestHeader("Authorization") String authHeader,
                                 @RequestBody Map<String,String> b) throws IOException, InterruptedException {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No Bearer token");
        }

        String jwt = authHeader.substring("Bearer ".length());
        String email = jwtService.extractUsername(jwt);

        if (userRepository.findByEmail(email).isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "User doesn't exist"));
        }
        String code = b.get("code");
        int langId = Integer.parseInt(b.get("language_id"));
        String output = b.get("output");
        String input = b.get("input");


        String token = judgeService.submit(code, input, langId, output);

        String out = judgeService.fetchResult(token);
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(out);

        return ResponseEntity
                .status(200)
                .body(Map.of("message", rootNode.get("expected_output"). asText().equals(rootNode.get("stdout"). asText())));
    }


}
