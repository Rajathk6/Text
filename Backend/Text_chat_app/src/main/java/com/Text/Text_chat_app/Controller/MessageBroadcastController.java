package com.Text.Text_chat_app.Controller;

import java.time.LocalDateTime;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

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

    @MessageMapping("/chat.private")
    public void privateMessage(@Payload MessageRequest messageRequest) {
        // Gets a private message from a particular user and saves it in the database
        message newMessage = new message();
        newMessage.setSender(messageRequest.getSender());
        newMessage.setReceiver(messageRequest.getReceiver());
        newMessage.setContent(messageRequest.getContent());
        newMessage.setTimestamp(LocalDateTime.now());
        
        messageRepo.save(newMessage);

        // you got the private message from a user, now its time to forward that message to intended user
        messagingTemplate.convertAndSendToUser(
            messageRequest.getReceiver(), 
            "/queue/messages", 
            newMessage
        );
        
        // Send back to sender (for multi-device sync) so that the same user can see his text if he logs in from another device
        messagingTemplate.convertAndSendToUser(
            messageRequest.getSender(),
            "/queue/messages",
            newMessage
        );
    }
    
    @MessageMapping("/chat.public")
    public void publicMessage(@Payload MessageRequest messageRequest) {
    
    message newMessage = new message();
    newMessage.setSender(messageRequest.getSender());
    newMessage.setReceiver("GROUP"); 
    newMessage.setContent(messageRequest.getContent());
    newMessage.setTimestamp(LocalDateTime.now());

    messageRepo.save(newMessage); 

    // Send message to all connected users
    messagingTemplate.convertAndSend("/topic/public", newMessage); 
}

}