package com.backend.backend.payload;

public record SubmissionResultDTO(
        String token,
        String user,             // who submitted
        boolean passed,          // overall verdict
        int passedCount,         // number of tests passed
        int totalCount,
        String verdict           // "AC", "WA", "TLE", etc.
) {}
