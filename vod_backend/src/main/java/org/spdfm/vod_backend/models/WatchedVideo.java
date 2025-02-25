package org.spdfm.vod_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "watched_videos")
public class WatchedVideo {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String videoId;

    private LocalDateTime watchedAt;

    public WatchedVideo(String userId, String videoId) {
        this.userId = userId;
        this.videoId = videoId;
        this.watchedAt = LocalDateTime.now();
    }
}
