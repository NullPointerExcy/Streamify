package org.spdfm.vod_backend.repositories;

import org.spdfm.vod_backend.models.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Set;

public interface CommentRepository extends MongoRepository<Comment, String> {

    public Set<Comment> findByTopicId(String topicId);

    public Set<Comment> findByCreatedById(String userId);


}
