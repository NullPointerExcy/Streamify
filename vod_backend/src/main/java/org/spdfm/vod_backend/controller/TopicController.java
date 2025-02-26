package org.spdfm.vod_backend.controller;

import org.spdfm.vod_backend.models.Game;
import org.spdfm.vod_backend.models.Topic;
import org.spdfm.vod_backend.services.GameService;
import org.spdfm.vod_backend.services.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/topics")
public class TopicController {

    @Autowired
    private TopicService topicService;

    @GetMapping
    public List<Topic> getAllTopics() {
        return topicService.getAllTopics();
    }

    @GetMapping("/{id}")
    public Optional<Topic> getTopicById(@PathVariable String id) {
        return topicService.getTopicById(id);
    }

    @GetMapping("/user/{id}")
    public Set<Topic> getTopicsByUserId(@PathVariable String id) {
        return topicService.getTopicsByUserId(id);
    }

    @PostMapping
    public Topic addTopic(@RequestBody Topic topic) {
        return topicService.addTopic(topic);
    }

    @PutMapping("/{topicId}/addComment/{commentId}")
    public Optional<Topic> addCommentToTopic(@PathVariable String topicId, @PathVariable String commentId) {
        return topicService.addCommentToTopic(topicId, commentId);
    }

    @DeleteMapping("/{id}")
    public void deleteTopic(@PathVariable String id) {
        topicService.deleteTopic(id);
    }

}
