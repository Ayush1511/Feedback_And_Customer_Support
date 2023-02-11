package com.jubl.food.kafkaconsumer.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Message {
    private String sessionId;

    private Long timestamp;

    private String text;

    private String event;

    private String userId;

    private String agentId;

    private HashMap<String,?> metadata;
}
