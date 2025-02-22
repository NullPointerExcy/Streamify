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

    private String description;

    private LocalDateTime createdAt = LocalDateTime.now();

    @DBRef
    private User createdBy;

    @DBRef
    private Set<Comment> comments;
}
