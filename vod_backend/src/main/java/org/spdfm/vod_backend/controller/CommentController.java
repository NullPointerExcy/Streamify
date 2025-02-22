package org.spdfm.vod_backend.controller;


import org.spdfm.vod_backend.models.Comment;
import org.spdfm.vod_backend.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping
    public List<Comment> getAllComments() {
        return commentService.getAllComments();
    }

    @GetMapping("/{id}")
    public Optional<Comment> getCommentById(@PathVariable String id) {
        return commentService.getCommentById(id);
    }

    @GetMapping("/comments/topic/{id}")
    public Set<Comment> getCommentsByTopicId(@PathVariable String id) {
        return commentService.getCommentsByTopicId(id);
    }

    @GetMapping("/comments/user/{id}")
    public Set<Comment> getCommentsByUserId(@PathVariable String id) {
        return commentService.getCommentsByUserId(id);
    }

    @PostMapping
    public Comment addComment(@RequestBody Comment topic) {
        return commentService.addComment(topic);
    }

}
