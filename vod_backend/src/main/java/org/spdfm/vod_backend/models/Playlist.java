package org.spdfm.vod_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "playlists")
public class Playlist {

    @Id
    private String id;

    private String title;
    private String description;
    private List<String> videoIds;

    // Constructor for new playlists
    public Playlist(String title, String description, List<String> videoIds) {
        this.title = title;
        this.description = description;
        this.videoIds = videoIds;
    }
}
