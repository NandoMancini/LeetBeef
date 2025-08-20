package com.backend.backend.service;

import com.backend.backend.model.Room;
import com.backend.backend.model.RoomMember;
import com.backend.backend.repository.RoomMemberRepository;
import com.backend.backend.repository.RoomRepository;
import com.backend.backend.util.TokenGenerator;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class RoomService {
    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final TokenGenerator tokens;

    public RoomService(RoomRepository roomRepository,
                       RoomMemberRepository roomMemberRepository,
                       TokenGenerator tokens) {
        this.roomRepository = roomRepository;
        this.roomMemberRepository = roomMemberRepository;
        this.tokens = tokens;
    }

    public Room createRoom(String email, String difficulty) {

        Room room = new Room();
        String token = tokens.nextToken(8);
        room.setToken(token);
        room.setDifficulty(difficulty);
        room.setStatus(Room.status.WAITING);
        room.setMembers(1);
        roomRepository.save(room);

        RoomMember roomMember = new RoomMember();
        roomMember.setToken(token);
        roomMember.setEmail(email);
        roomMemberRepository.save(roomMember);

        return room;
    }

}
