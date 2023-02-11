package com.jubl.food.kafkaconsumer.repo;

import com.jubl.food.kafkaconsumer.model.ChatMessageResponse;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessageResponse, ObjectId> {

    @Query("{'sessionId' : ?0}")
    List<ChatMessageResponse> findMessagesByChatSessionId(String chatSessionId);
}
