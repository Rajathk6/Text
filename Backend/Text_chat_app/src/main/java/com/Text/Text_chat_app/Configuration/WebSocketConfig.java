package com.Text.Text_chat_app.Configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/user");  // brokers for setting up the communication
        registry.setApplicationDestinationPrefixes("/app"); // App path
        registry.setUserDestinationPrefix("/user");   // springboot default
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // ======= dont forget to change it to the actual url in deployment ========
        registry.addEndpoint("/ws-endpoint").setAllowedOriginPatterns(ProductionConfig.FRONTENT_URL).withSockJS()
        .setWebSocketEnabled(true);
    }
}
