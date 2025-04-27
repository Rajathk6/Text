package com.Text.Text_chat_app.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Text.Text_chat_app.Model.Message;
import com.Text.Text_chat_app.Repository.MessageRepo;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageRepo messageRepo;

    public MessageController(MessageRepo messageRepo) {
        this.messageRepo = messageRepo;
    }
    // retrive the conversation between 2 users who are currently chatting (one is the logged in user another is the friend the logged user wants to chat with)
    @GetMapping("/conversation")
    public ResponseEntity<List<Message>> getConversation(
            @RequestParam("user1") String user1, 
            @RequestParam("user2") String user2) {
        
        List<Message> messages = messageRepo.findConversationBetweenUsers(user1, user2);
        return ResponseEntity.ok(messages);
    }
}
