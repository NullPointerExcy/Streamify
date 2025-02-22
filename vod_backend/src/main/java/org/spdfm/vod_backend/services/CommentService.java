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
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public Optional<Comment> getCommentById(String id) {
        return commentRepository.findById(id);
    }

    public Comment addComment(Comment comment) {
        return commentRepository.save(comment);
    }

    public Set<Comment> getCommentsByTopicId(String topicId) {
        return commentRepository.findByTopicId(topicId);
    }

    public Set<Comment> getCommentsByUserId(String userId) {
        return commentRepository.findByCreatedById(userId);
    }

}
