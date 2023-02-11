package com.jubl.food.kafkaconsumer.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "conversations")
public class ChatMessageResponse {

    private String sender_id;

    private List<ChatMessage> messages;

    private String user_id;
}
