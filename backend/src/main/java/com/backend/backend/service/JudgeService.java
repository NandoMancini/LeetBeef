package com.backend.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;
import java.util.Optional;

@Service
public class JudgeService {
    public JudgeService(WebClient.Builder b) throws IOException{
    }

    public String submit(String code,String input, int langId, String output) throws IOException, InterruptedException {
        try {
            code = Base64.getEncoder().encodeToString(code.getBytes());
            output = Base64.getEncoder().encodeToString(output.getBytes());
            input = Base64.getEncoder().encodeToString(input.getBytes());


            String body = String.format(
                    "{\"language_id\":\"%s\",\"source_code\":\"%s\",\"stdin\":\"%s\",\"expected_output\":\"%s\"}",
                    langId,
                    code,
                    input,
                    output
            );
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*"))
                    .header("x-rapidapi-key", "d05fd9b9c0msh10b0f93b318cd3bp1a7e56jsnec62893c8c62")
                    .header("x-rapidapi-host", "judge0-ce.p.rapidapi.com")
                    .header("Content-Type", "application/json")
                    .method("POST", HttpRequest.BodyPublishers.ofString(body))
                    .build();
            HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response.body());
            String token = rootNode.get("token").asText();
            System.out.println(token);
            return token;
        }
        catch (Exception e) {
            System.out.println(e);
            return e.getMessage();
        }
    }

    public String fetchResult(String token) throws IOException, InterruptedException {
        String url = String.format(
                "https://judge0-ce.p.rapidapi.com/submissions/%s?base64_encoded=true&fields=*",
                token
        );
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("x-rapidapi-key", "d05fd9b9c0msh10b0f93b318cd3bp1a7e56jsnec62893c8c62")
                .header("x-rapidapi-host", "judge0-ce.p.rapidapi.com")
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
        return response.body();
    }
}
