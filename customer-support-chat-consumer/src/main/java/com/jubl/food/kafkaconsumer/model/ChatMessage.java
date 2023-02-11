package com.jubl.food.kafkaconsumer.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "conversations")
public class ChatMessage extends Message {

}
