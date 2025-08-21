package com.backend.backend.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.nio.charset.StandardCharsets;

@Configuration
@EnableWebSocketMessageBroker
public class WsDebugConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureClientOutboundChannel(ChannelRegistration reg) {
        reg.interceptors(new ChannelInterceptor() {
            @Override public Message<?> preSend(Message<?> m, MessageChannel c) {
                log("OUT", m); return m;
            }
        });
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration reg) {
        reg.interceptors(new ChannelInterceptor() {
            @Override public Message<?> preSend(Message<?> m, MessageChannel c) {
                log("IN ", m); return m;
            }
        });
    }

    private static void log(String tag, Message<?> msg) {
        String dest = String.valueOf(msg.getHeaders().get("simpDestination"));
        Object payload = msg.getPayload();
        String body = (payload instanceof byte[])
                ? new String((byte[]) payload, java.nio.charset.StandardCharsets.UTF_8)
                : String.valueOf(payload);

        // Pretty-print JSON if possible
        try {
            com.google.gson.JsonElement je = com.google.gson.JsonParser.parseString(body);
            body = new com.google.gson.GsonBuilder().setPrettyPrinting().create().toJson(je);
        } catch (Exception ignore) {}

        System.out.printf("[STOMP %s] dest=%s%n%s%n", tag, dest, body);
    }
}