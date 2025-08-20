package com.backend.backend.payload;

public record WsEvent<T>(
        String type,   // "ROOM_WAITING", "ROOM_READY", "MATCH_STARTED", "SUBMISSION_RESULT", "MATCH_ENDED"
        T payload
) {}
