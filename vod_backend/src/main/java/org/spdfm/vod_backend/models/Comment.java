package org.spdfm.vod_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Data
@Document(collection = "comments")
public class Comment {

    @Id
    private String id;

    @NotBlank(message = "Content is mandatory")
    private String content;

    private LocalDateTime createdAt = LocalDateTime.now();

    @DBRef
    private User createdBy;

    @DBRef
    private Topic topic;
}
