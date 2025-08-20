package com.backend.backend;

import com.backend.backend.service.QuestionService;

import java.io.IOException;

public class TestRunner {
    public static void main(String[] args) throws IOException {
        QuestionService service = new QuestionService();
        service.generateEasy();
        service.generateMedium();
        service.generateHard();
    }
}