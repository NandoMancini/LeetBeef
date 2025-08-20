package com.backend.backend.service;
import com.google.gson.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.springframework.stereotype.Service;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class QuestionService {

    public JsonObject generateEasy() throws IOException {

        int randomNum = ThreadLocalRandom.current().nextInt(0, 384);

        String content = new String(Files.readAllBytes(Paths.get("data/scraped_questions.json")));

        JsonArray arr = JsonParser.parseString(content).getAsJsonArray();

        return arr.get(randomNum).getAsJsonObject();
    }

    public JsonObject generateMedium() throws IOException {

        int randomNum = ThreadLocalRandom.current().nextInt(385, 1190);

        String content = new String(Files.readAllBytes(Paths.get("data/scraped_questions.json")));

        JsonArray arr = JsonParser.parseString(content).getAsJsonArray();

        return arr.get(randomNum).getAsJsonObject();

    }

    public JsonObject generateHard() throws IOException {

        int randomNum = ThreadLocalRandom.current().nextInt(1191, 2141);

        String content = new String(Files.readAllBytes(Paths.get("data/scraped_questions.json")));

        JsonArray arr = JsonParser.parseString(content).getAsJsonArray();

        return arr.get(randomNum).getAsJsonObject();
    }
}
