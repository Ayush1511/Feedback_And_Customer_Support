package com.jubl.food.kafkaconsumer.config;

import com.jubl.food.kafkaconsumer.model.Message;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@EnableKafka
@Configuration
@RefreshScope
public class KafkaConsumerConfig {

    /**
     * bootstrapAddress.
     */
    @Value(value = "${kafka.bootstrapAddress}")
    private String bootstrapAddress;
    /**
     * consumerSessionTimeout.
     */
    @Value(value = "${bulk.consumer.session.timeout}")
    private int consumerSessionTimeout;
    /**
     * heartbeatInterval.
     */
    @Value(value = "${bulk.consumer.heartbeat.interval}")
    private int heartbeatInterval;
    /**
     * maxPollInterval.
     */
    @Value(value = "${bulk.consumer.max.poll.interval}")
    private int maxPollInterval;
    /**
     * maxPollRecords.
     */
    @Value(value = "${bulk.consumer.max.poll.records}")
    private int maxPollRecords;

    /**
     * @param groupId groupId
     * @return ConsumerFactory<String, Message>
     */
    public ConsumerFactory<String,
            Message> chatConsumerFactory(final String groupId) {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapAddress);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG,
                consumerSessionTimeout);
        props.put(ConsumerConfig.HEARTBEAT_INTERVAL_MS_CONFIG,
                heartbeatInterval);
        props.put(ConsumerConfig.MAX_POLL_INTERVAL_MS_CONFIG, maxPollInterval);
        props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, maxPollRecords);
        return new DefaultKafkaConsumerFactory<>(props,
                new StringDeserializer(),
                new JsonDeserializer<>(Message.class));
    }

    /**
     * @return ConcurrentKafkaListenerContainerFactory
     */
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String,
            Message> chatKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, Message> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(chatConsumerFactory("consumerGroup"));
        return factory;
    }
}
