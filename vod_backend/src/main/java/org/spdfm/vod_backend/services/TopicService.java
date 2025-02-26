package org.spdfm.vod_backend.services;

import org.spdfm.vod_backend.models.Comment;
import org.spdfm.vod_backend.models.Topic;
import org.spdfm.vod_backend.repositories.CommentRepository;
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

    @Autowired
    private CommentRepository commentRepository;

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

    public Optional<Topic> addCommentToTopic(String topicId, String commentId) {
        Optional<Topic> topic = topicRepository.findById(topicId);
        if (topic.isPresent()) {
            Optional<Comment> comment = commentRepository.findById(commentId);
            if (comment.isPresent()) {
                topic.get().getComments().add(comment.get());
                return Optional.of(topicRepository.save(topic.get()));
            }
        }
        return Optional.empty();
    }

    public void deleteTopic(String id) {
        topicRepository.deleteById(id);
    }

}
