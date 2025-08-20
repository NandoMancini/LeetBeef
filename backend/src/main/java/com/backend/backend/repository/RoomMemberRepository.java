package com.backend.backend.repository;

import com.backend.backend.model.Room;
import com.backend.backend.model.RoomMember;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface RoomMemberRepository extends CrudRepository<RoomMember, Long> {
    Optional<RoomMember> findByToken(String token);
    Optional<RoomMember> findByEmail(String email);
}
