package org.spdfm.vod_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.Set;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    @Email(message = "Invalid email")
    @NotBlank(message = "Email is mandatory")
    private String email;

    @NotBlank(message = "Username is mandatory")
    private String name;

    private String password;
    private Set<Role> roles;
    private String userImage;

    private long totalViewTime = 0;
    private int totalVideosWatched = 0;
    private int totalCreatedTopics = 0;
    private int totalComments = 0;

    private Boolean isBanned = false;

    @DBRef
    private Set<Topic> topics;

    @DBRef
    private Set<Comment> comments;

    @DBRef
    private Set<Video> watchedVideos;

    @DBRef
    private Video lastWatchedVideo;
}

