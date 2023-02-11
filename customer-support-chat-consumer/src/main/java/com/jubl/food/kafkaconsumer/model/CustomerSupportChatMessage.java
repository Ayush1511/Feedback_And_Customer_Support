package com.jubl.food.kafkaconsumer.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "CustomerSupportUserConversations")
public class CustomerSupportChatMessage extends Message {
}
