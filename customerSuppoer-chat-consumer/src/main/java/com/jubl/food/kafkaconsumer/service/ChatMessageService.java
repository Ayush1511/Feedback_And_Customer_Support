package com.jubl.food.kafkaconsumer.service;

import com.jubl.food.kafkaconsumer.model.CustomerSupportChatMessage;
import com.jubl.food.kafkaconsumer.model.ChatMessage;
import com.jubl.food.kafkaconsumer.model.ChatMessageResponse;
import com.jubl.food.kafkaconsumer.model.Message;
import com.jubl.food.kafkaconsumer.repo.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatMessageService {
    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public void saveChatMessage(Message chatMessage) {
        Query query = new Query();
        Update update = new Update();

        query.addCriteria(Criteria.where("sessionId").is(chatMessage.getSessionId()));
        update.push("messages").each(chatMessage);

        if(StringUtils.hasText(chatMessage.getUserId())) {
            update.set("user_id",chatMessage.getUserId());
        }
        if(StringUtils.hasText(chatMessage.getAgentId())) {
            update.set("agent_id",chatMessage.getAgentId());
        }
        chatMessage.setSessionId(null);
        chatMessage.setUserId(null);
        chatMessage.setAgentId(null);
        mongoTemplate.upsert(query, update, CustomerSupportChatMessage.class);
    }

    public List<ChatMessage> getChatMessagesList(String chatSessionId) {
        List<ChatMessageResponse> chatMessageResponseList = Collections.emptyList();
        if( chatSessionId != null && !chatSessionId.isBlank()){
            chatMessageResponseList = chatMessageRepository.findMessagesByChatSessionId(chatSessionId);
        }
        List<ChatMessage> chatMessageList = chatMessageResponseList.stream().flatMap(messages -> messages.getMessages().stream()).collect(Collectors.toList());
        chatMessageList.sort(Comparator.comparing(ChatMessage::getTimestamp));

        return chatMessageList;
    }
}
