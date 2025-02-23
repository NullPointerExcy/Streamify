package org.spdfm.vod_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "playlists")
public class Playlist {

    @Id
    private String id;

    private String title;
    private String description;

    @DBRef(lazy = false)
    private List<Video> videos;

    public Playlist(String title, String description, List<Video> videos) {
        this.title = title;
        this.description = description;
        this.videos = videos;
    }

    public void addVideo(Video video) {
        this.videos.add(video);
    }
}
