package com.backend.backend.controller;

import com.backend.backend.model.User;
import com.backend.backend.payload.JwtResponse;
import com.backend.backend.payload.LoginRequest;
import com.backend.backend.payload.RegisterRequest;
import com.backend.backend.repository.UserRepository;
import com.backend.backend.service.JwtService;
import com.backend.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final UserRepository userRepository;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserService userService,
            UserRepository userRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    /**
     * Local registration. Client posts JSON { "username": "...", "email": "...", "password": "..." }.
     * We create a new User(authProvider=LOCAL) and return 201 Created with no body (or a short success JSON).
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        // 1) Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Email already in use"));
        }

        // 2) Create new User
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        User saved = userService.registerUser(user);

        // 3) Return 201 CREATED (no body; front‐end can redirect to /login)
        return ResponseEntity
                .status(201)
                .body(Map.of("message", "User registered successfully"));
    }

    /**
     * Local login. Client posts { "email": "...", "password": "..." }. We authenticate and
     * return { "token":"<JWT>" } on success, or 401 on failure.
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        // 1) Perform authentication; if fails, Spring will throw an exception (401)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 2) Generate JWT for this user
        UserDetails principal = (UserDetails) authentication.getPrincipal();
        String jwt = jwtService.generateToken(principal);

        // 3) Return token in body
        return ResponseEntity.ok(new JwtResponse(jwt, "Bearer"));
    }
}
