package com.Text.Text_chat_app.Controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.Text.Text_chat_app.Model.MessageRequest;
import com.Text.Text_chat_app.Model.message;
import com.Text.Text_chat_app.Repository.MessageRepo;


@Controller
public class MessageBroadcastController {

    private final MessageRepo messageRepo;

    public MessageBroadcastController(MessageRepo messageRepo) {
        this.messageRepo = messageRepo;
    }

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public String broadcastMessage() {
        // message newMessage = new message();
        // newMessage.setSender(messageReq.getSender());
        // newMessage.setReceiver(messageReq.getReceiver());
        // newMessage.setContent(messageReq.getContent());
        // newMessage.setTimestamp(LocalDateTime.now()); // Consider setting timestamp on the server

        // messageRepo.save(newMessage);

        // // Send to the receiver's topic
        // messagingTemplate.convertAndSendToUser(
        //     messageReq.getReceiver(), 
        //     "queue.messages", 
        //     newMessage
        // );
        return "this is backend";
    }
}

