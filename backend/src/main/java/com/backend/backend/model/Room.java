package com.backend.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Setter
@Getter
@Entity
@Table(name = "Room")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;
    private int members;
    private String difficulty;


    private Instant startedAt;

    private Instant endsAt;

    private Integer duration;

    @Enumerated(EnumType.STRING)
    private Room.status status;

    public enum status {
        READY, WAITING, IN_PROGRESS, FINISHED
    }
}
