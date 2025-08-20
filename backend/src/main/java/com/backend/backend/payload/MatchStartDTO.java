package com.backend.backend.payload;

import com.google.gson.JsonObject;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record MatchStartDTO (
        String token,          // WRTHET42
        Map<String,Object> details,

        int timeLimitSec,  // emails or userIds
        Instant startsAt
) {}
