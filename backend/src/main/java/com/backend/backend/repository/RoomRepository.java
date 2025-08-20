package com.backend.backend.repository;

import com.backend.backend.model.Room;
import com.backend.backend.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomRepository  extends CrudRepository<Room, Long> {
    Optional<Room> findByToken(String token);
}
