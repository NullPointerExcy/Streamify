package org.spdfm.vod_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "guest_views")
public class GuestView {

    @Id
    private String id;

    @Indexed
    private String ipAddress;

    @Indexed
    private String videoId;

    private LocalDateTime viewedAt;

    public GuestView(String ipAddress, String videoId) {
        this.ipAddress = ipAddress;
        this.videoId = videoId;
        this.viewedAt = LocalDateTime.now();
    }
}
