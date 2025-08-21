package com.backend.backend.controller;

import com.backend.backend.model.Room;
import com.backend.backend.model.RoomMember;
import com.backend.backend.model.User;
import com.backend.backend.payload.MatchEndDTO;
import com.backend.backend.payload.MatchStartDTO;
import com.backend.backend.payload.RoomStateDTO;
import com.backend.backend.payload.WsEvent;
import com.backend.backend.repository.RoomMemberRepository;
import com.backend.backend.repository.RoomRepository;
import com.backend.backend.repository.UserRepository;
import com.backend.backend.service.JwtService;
import com.backend.backend.service.QuestionService;
import com.backend.backend.service.RoomService;
import com.backend.backend.service.UserService;
import com.backend.backend.util.TokenGenerator;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.swing.text.html.Option;
import java.io.IOException;
import java.nio.file.attribute.UserPrincipal;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static java.time.Instant.now;

@RestController
@RequestMapping("/api/room")
public class RoomController {
    private final JwtService jwtService;
    private final RoomService roomService;
    private final UserRepository userRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final RoomRepository roomRepository;
    private final TokenGenerator tokens;
    private final QuestionService questionService;
    private final SimpMessagingTemplate broker;

    public RoomController(
            JwtService jwtService,
            RoomService roomService,
            UserRepository userRepository,
            RoomMemberRepository roomMemberRepository,
            RoomRepository roomRepository,
            TokenGenerator tokens,
            QuestionService questionService,
            SimpMessagingTemplate broker) {
        this.jwtService = jwtService;
        this.roomService = roomService;
        this.userRepository = userRepository;
        this.roomMemberRepository = roomMemberRepository;
        this.roomRepository = roomRepository;
        this.tokens = tokens;
        this.questionService = questionService;
        this.broker = broker;

    }
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestHeader("Authorization") String authHeader,
                                     @RequestBody Map<String,String> b) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No Bearer token");
        }

        String token = authHeader.substring("Bearer ".length());

        String difficulty = b.get("difficulty");
        String email  = jwtService.extractUsername(token);
        if (userRepository.findByEmail(email).isEmpty()){
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "User doesn't exist"));
        }
        Optional<RoomMember> user = roomMemberRepository.findByEmail(email);
        if (user.isPresent()){
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "A user with the same name is already in a different room"));
        }
        Room room = roomService.createRoom(email, difficulty);
        var dto = new RoomStateDTO(
                room.getToken(),
                "WAITING",
                room.getDifficulty(),
                java.time.Instant.now()
        );
        broker.convertAndSend("/topic/room." + room.getToken(), new WsEvent<>("ROOM_WAITING", dto));
        return ResponseEntity
                .status(201)
                .body(Map.of("message", "Room created successfully"));
    }

    @PostMapping("/join/{token}")
    public ResponseEntity<?>  join(@PathVariable String token,
                                   @RequestHeader("Authorization") String authHeader) throws IOException {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No Bearer token");
        }

        String jwt = authHeader.substring("Bearer ".length());
        String email  = jwtService.extractUsername(jwt);

        if (userRepository.findByEmail(email).isEmpty()){
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "User doesn't exist"));
        }
        Optional<RoomMember> user = roomMemberRepository.findByEmail(email);
        if (user.isPresent()){
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "A user with the same name is already in a different room"));
        }

        Optional<Room> room = roomRepository.findByToken(token);
        if (room.isEmpty()){
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Room doesn't exist"));
        }
        if (room.get().getMembers() == 2){
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Room is full"));
        }

        RoomMember roomMember = new RoomMember();
        roomMember.setToken(token);
        roomMember.setEmail(email);
        roomMemberRepository.save(roomMember);
        room.get().setMembers(2);
        room.get().setStatus(Room.status.READY);
        roomRepository.save(room.get());
        var dto = new RoomStateDTO(
                token, "READY", room.get().getDifficulty(),
                java.time.Instant.now()
        );
        broker.convertAndSend("/topic/room." + token, new WsEvent<>("ROOM_READY", dto));

        return ResponseEntity
                .status(201)
                .body(Map.of("message", "Room successfully joined"));
    }

    @PostMapping("/start/{token}")
    public ResponseEntity<?> start(@RequestHeader("Authorization") String authHeader,
                                   @PathVariable String token) throws IOException {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No Bearer token");
        }

        String jwt = authHeader.substring("Bearer ".length());
        String email  = jwtService.extractUsername(jwt);

        if (userRepository.findByEmail(email).isEmpty()){
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "User doesn't exist"));
        }
        Optional<RoomMember> user = roomMemberRepository.findByEmail(email);

        Optional<Room> room = roomRepository.findByToken(token);
        if (room.isEmpty()){
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Room doesn't exist"));
        }
        if (room.get().getMembers() != 2){
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Room does not have enough players"));
        }
        room.get().setStatus(Room.status.IN_PROGRESS);
        room.get().setStartedAt(now());
        room.get().setDuration(1800);
        room.get().setEndsAt(room.get().getStartedAt().plusSeconds(1800));
        roomRepository.save(room.get());

        JsonObject q = switch (room.get().getDifficulty().toLowerCase()) {
            case "medium" -> questionService.generateMedium();
            case "easy"   -> questionService.generateEasy();
            default       -> questionService.generateHard();
        };

        Map<String,Object> details = new Gson().fromJson(
                q, new TypeToken<Map<String,Object>>(){}.getType()
        );

        var startDto = new MatchStartDTO(
                token,
                details,
                900, // example 15 min
                java.time.Instant.now()
        );
        broker.convertAndSend("/topic/room." + token, new WsEvent<>("MATCH_STARTED", startDto));

        return ResponseEntity
                .status(200)
                .body(Map.of("message", "Match succesfully started"));
    }

    @PostMapping("/end/{token}")
    public ResponseEntity<?> end(@RequestHeader("Authorization") String authHeader,
                                @PathVariable String token,
                                  @RequestParam UUID winnerId) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No Bearer token");
        }

        String jwt = authHeader.substring("Bearer ".length());
        String email  = jwtService.extractUsername(jwt);

        if (userRepository.findByEmail(email).isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "User doesn't exist"));
        }

        Optional<Room> room = roomRepository.findByToken(token);
        if (room.isEmpty()){
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Room doesn't exist"));
        }
        if (room.get().getMembers() != 2){
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Room does not have enough players"));
        }
        room.get().setStatus(Room.status.FINISHED);
        roomRepository.save(room.get());


        var winner = winnerId.toString(); // or map to email/username
        var endDto = new MatchEndDTO(token, winner, "MOST_TESTS", java.time.Instant.now());
        broker.convertAndSend("/topic/room." + token, new WsEvent<>("MATCH_ENDED", endDto));

        return ResponseEntity.ok(Map.of("message","Match successfully finished"));
    }

    @PostMapping("/leave")
    public ResponseEntity<?> leave(@RequestHeader("Authorization") String authHeader,
                                    @RequestBody Map<String,String> b) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No Bearer token");
        }

        String token = authHeader.substring("Bearer ".length());

        String difficulty = b.get("difficulty");
        String email  = jwtService.extractUsername(token);
        if (userRepository.findByEmail(email).isEmpty()){
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "User doesn't exist"));
        }
        Optional<RoomMember> user = roomMemberRepository.findByEmail(email);
        if (user.isEmpty()){
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "The user with the given email is not in any room"));
        }
        Room room = roomService.createRoom(email, difficulty);
        var dto = new RoomStateDTO(
                room.getToken(),
                "WAITING",
                room.getDifficulty(),
                java.time.Instant.now()
        );
        broker.convertAndSend("/topic/room." + room.getToken(), new WsEvent<>("ROOM_WAITING", dto));
        return ResponseEntity
                .status(201)
                .body(Map.of("message", "Room created successfully"));
    }

}
