package org.spdfm.vod_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Document(collection = "topics")
public class Topic {

    @Id
    private String id;

    @NotBlank(message = "Title is mandatory")
    private String title;

    @NotBlank(message = "Content is mandatory")
    private String content;

    private LocalDateTime createdAt = LocalDateTime.now();

    @DBRef
    private User createdBy;

    @DBRef
    private Set<Comment> comments;

    @DBRef
    private Set<Game> relatedGames;

    public Topic(String title, String content, User createdBy, Set<Comment> comments, Set<Game> relatedGames) {
        this.title = title;
        this.content = content;
        this.createdBy = createdBy;
        this.relatedGames = relatedGames;
        this.comments = comments;
        this.createdAt = LocalDateTime.now();
    }
}
