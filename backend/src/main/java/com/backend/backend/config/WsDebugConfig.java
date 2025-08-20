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
    public void configureClientOutboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override public Message<?> preSend(Message<?> message, MessageChannel channel) {
                log("[STOMP OUT]", message);
                return message;
            }
        });
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override public Message<?> preSend(Message<?> message, MessageChannel channel) {
                log("[STOMP IN ]", message);
                return message;
            }
        });
    }

    private static void log(String tag, Message<?> msg) {
        Object payload = msg.getPayload();
        String body = (payload instanceof byte[])
                ? new String((byte[]) payload, StandardCharsets.UTF_8)
                : String.valueOf(payload);
        System.out.printf("%s dest=%s user=%s body=%s%n",
                tag,
                msg.getHeaders().get("simpDestination"),
                msg.getHeaders().get("simpUser"),
                body);
    }
}
