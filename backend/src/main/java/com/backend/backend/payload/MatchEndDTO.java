package com.backend.backend.payload;


import java.time.Instant;

public record MatchEndDTO(
        String token,
        String winner,           // email/userId or "TIE" / "TIMEOUT"
        String reason,           // "MOST_TESTS", "TIMEOUT", "FORFEIT"
        Instant endedAt
) {}