package org.spdfm.vod_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "watch_lists")
public class WatchList {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String videoId;

    private LocalDateTime addedAt;

    public WatchList(String userId, String videoId) {
        this.userId = userId;
        this.videoId = videoId;
        this.addedAt = LocalDateTime.now();
    }
}
