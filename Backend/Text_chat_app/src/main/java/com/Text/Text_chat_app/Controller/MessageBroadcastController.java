package com.Text.Text_chat_app.Controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import com.Text.Text_chat_app.Model.MessageRequest;
import com.Text.Text_chat_app.Model.message;
import com.Text.Text_chat_app.Repository.MessageRepo;


@Controller
public class MessageBroadcastController {

    private MessageRepo messageRepo;

    public MessageBroadcastController(MessageRepo messageRepo) {
        this.messageRepo = messageRepo;
    }

    @MessageMapping("/chat/{friendId}") // /app/chat is where you receive all your message
    @SendTo("/topic/message{friendId}") // where you send all your messages
    public message broadcastMessage(@DestinationVariable String receiver,@RequestBody MessageRequest messageReq) {

        message username = messageRepo.findByReceiverName(messageReq.getReceiver());

        message messy = new message();
        messy.setSender(messageReq.getSender());
        messy.setReceiver(messageReq.getReceiver());
        messy.setContent(messageReq.getContent());
        messy.setTimestamp(messageReq.getTimestamp());

        if (username != null) {
            messageRepo.findConversationBetweenUsers(receiver, receiver).add(messy);
            messageRepo.save(messy);
        }
        return new message();
    }
}
