package com.jubl.food.kafkaconsumer.controller;

import com.jubl.food.kafkaconsumer.model.ChatMessage;
import com.jubl.food.kafkaconsumer.repo.ChatMessageRepository;
import com.jubl.food.kafkaconsumer.service.ChatMessageService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/ve/v1")
@Log4j2
public class ChatMessageController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ChatMessageService chatMessageService;

    @GetMapping(value = "/chat-messages")
    public ResponseEntity<Object> getChatMessages(@RequestParam(value = "chat_session_id", defaultValue = "") String chatSessionId)
            throws Exception {
        log.info("Chat Messages data api starts for sessionId: " + chatSessionId);
        List<ChatMessage> chatMessageList = null;
        try {
            chatMessageList = chatMessageService.getChatMessagesList(chatSessionId);
            log.info("Final Response returned. ");
            return ResponseEntity.ok().body(chatMessageList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Date format is Incorrect");
        }
    }
}
