package com.backend.backend.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Component
public class TokenGenerator {
    private final SecureRandom random = new SecureRandom();
    private static final String ALPHANUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    public String nextToken(int length) {
        return IntStream.range(0, length)
                .map(i -> ALPHANUM.charAt(random.nextInt(ALPHANUM.length())))
                .mapToObj(c -> String.valueOf((char)c))
                .collect(Collectors.joining());
    }
}