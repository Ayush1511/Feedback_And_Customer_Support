package com.jubl.food.kafkaconsumer.consumerservice;

import com.jubl.food.kafkaconsumer.model.Message;
import com.jubl.food.kafkaconsumer.service.ChatMessageService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Log4j2
@RefreshScope
public class KafkaChatService {

    @Autowired
    ChatMessageService chatMessageService;

    public KafkaChatService() {}

    @KafkaListener(groupId = "${kafka.consumer.group.id}",
            topics = "${kafka.topic}",
            containerFactory = "chatKafkaListenerContainerFactory")
    public void consumeChatMessage(final Message message) {
        log.info("Json message received using Kafka listener - {}",message);
        chatMessageService.saveChatMessage(message);
    }
}
