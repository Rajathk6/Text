package com.Text.Text_chat_app.Controller;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import com.Text.Text_chat_app.Model.MessageRequest;
import com.Text.Text_chat_app.Model.message;
import com.Text.Text_chat_app.Repository.MessageRepo;

@Controller
public class MessageBroadcastController {
    private final MessageRepo messageRepo;
    private final SimpMessagingTemplate messagingTemplate;

    public MessageBroadcastController(MessageRepo messageRepo, SimpMessagingTemplate messagingTemplate) {
        this.messageRepo = messageRepo;
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleSessionSubscribe(SessionSubscribeEvent event) {
        System.out.println("Subscription: " + event.getMessage().getHeaders().get("simpDestination"));
    }

    @MessageMapping("/chat.private") // chat.private is to where the frontend publishes the message
    public void privateMessage(@Payload MessageRequest messageRequest) {
        // Save the message received from the frontend
        message newMessage = new message();
        newMessage.setSender(messageRequest.getSender());
        newMessage.setReceiver(messageRequest.getReceiver());
        newMessage.setContent(messageRequest.getContent());
        newMessage.setType(messageRequest.getType());
        newMessage.setTimestamp(ZonedDateTime.now());
        messageRepo.save(newMessage);
    
        // Add ISO format timestamp for frontend
        newMessage.setIsoTimestamp(newMessage.getTimestamp().format(DateTimeFormatter.ISO_INSTANT));
        
        // Send the message to the receiver at the endpoint they are listening to (endpoint specified in the frontend)
        messagingTemplate.convertAndSendToUser(
            messageRequest.getReceiver(), 
            "/messages", 
            newMessage
        );
    }

    // ======= Unimplemented ========
    @MessageMapping("/chat.public")
    public void publicMessage(@Payload MessageRequest messageRequest) {
    
        message newMessage = new message();
        newMessage.setSender(messageRequest.getSender());
        newMessage.setReceiver("GROUP"); 
        newMessage.setContent(messageRequest.getContent());
        newMessage.setTimestamp(ZonedDateTime.now());
        newMessage.setType(messageRequest.getType());
        
        messageRepo.save(newMessage); 

        // Send message to all connected users
        messagingTemplate.convertAndSend("/topic/public", newMessage); 
    }
}