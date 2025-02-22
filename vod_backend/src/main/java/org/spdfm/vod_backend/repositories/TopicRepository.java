package org.spdfm.vod_backend.repositories;

import org.spdfm.vod_backend.models.Topic;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Set;

public interface TopicRepository extends MongoRepository<Topic, String> {

    public Set<Topic> findByCreatedById(String userId);

}
