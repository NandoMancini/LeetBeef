package com.backend.backend.payload;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

public record RoomStateDTO(
        String token,          // WRTHET42
        String status,         // "WAITING" | "READY" | "RUNNING" | "ENDED"
        String difficulty,     // "easy" | "medium" | "hard"
        Instant updatedAt
) {}
