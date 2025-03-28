package com.Text.Text_chat_app.Controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MessageBroadcastController {
    @MessageMapping("/broadcast")
    @SendTo("/topic/reply")
    public String broadcastMessage(@Payload String message) {
        return "you received a message: " + message;
    }
}
