package com.Text.Text_chat_app.Model;

import java.time.ZonedDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageRequest {
    private String sender;
    private String receiver;
    private String content;
    private ZonedDateTime timestamp;
    private String type;
}
