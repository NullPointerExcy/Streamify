package org.spdfm.vod_backend.services;

import org.spdfm.vod_backend.models.Topic;
import org.spdfm.vod_backend.repositories.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class TopicService {

    @Autowired
    private TopicRepository topicRepository;

    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    public Optional<Topic> getTopicById(String id) {
        return topicRepository.findById(id);
    }

    public Topic addTopic(Topic topic) {
        return topicRepository.save(topic);
    }

    public Set<Topic> getTopicsByUserId(String userId) {
        return topicRepository.findByCreatedById(userId);
    }

}
