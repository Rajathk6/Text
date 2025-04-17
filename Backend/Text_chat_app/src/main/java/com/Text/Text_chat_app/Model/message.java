package com.Text.Text_chat_app.Model;

import java.time.ZonedDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "message")
public class message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String sender;
    private String receiver;
    private String content;
    @Column(columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime timestamp;  // Changed type
    private String type;

    // Add this transient field for ISO format
    @Transient
    private String isoTimestamp;

    // Getters and setters
    public ZonedDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(ZonedDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getIsoTimestamp() {
        return isoTimestamp;
    }

    public void setIsoTimestamp(String isoTimestamp) {
        this.isoTimestamp = isoTimestamp;
    }
}
