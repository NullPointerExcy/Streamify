package org.spdfm.vod_backend.models;

import lombok.Data;
import org.spdfm.vod_backend.models.Game;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Document(collection = "videos")
public class Video {

    @Id
    private String id;

    private String title;
    private String description;
    private String filePath;
    private String thumbnail;
    private Long duration;
    private LocalDateTime uploadedAt;
    private Long viewerCount;

    @DBRef
    private Game game;


    public Video(String title, String description, String filePath, String thumbnail, Long duration, Game game, Long viewerCount) {
        this.title = title;
        this.description = description;
        this.filePath = filePath;
        this.thumbnail = thumbnail;
        this.duration = duration;
        this.uploadedAt = LocalDateTime.now();
        this.game = game;
        this.viewerCount = viewerCount;
    }
}
