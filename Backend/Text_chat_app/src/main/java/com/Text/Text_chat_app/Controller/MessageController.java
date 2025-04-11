package com.Text.Text_chat_app.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Text.Text_chat_app.Model.message;
import com.Text.Text_chat_app.Repository.MessageRepo;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageRepo messageRepo;

    public MessageController(MessageRepo messageRepo) {
        this.messageRepo = messageRepo;
    }

    @GetMapping("/conversation")
    public ResponseEntity<List<message>> getConversation(
            @RequestParam("user1") String user1, 
            @RequestParam("user2") String user2) {
        
        List<message> messages = messageRepo.findConversationBetweenUsers(user1, user2);
        return ResponseEntity.ok(messages);
    }
}
