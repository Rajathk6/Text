package com.Text.Text_chat_app.Model;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Transient;
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
}
