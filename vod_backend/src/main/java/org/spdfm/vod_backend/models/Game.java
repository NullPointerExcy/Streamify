package org.spdfm.vod_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Set;

@Data
@Document(collection = "games")
public class Game {

    @Id
    private String id;

    private String title;
    private String developer;
    private String releaseDate;
    private String coverImage;

    @DBRef
    private List<Genre> genres;

    public Game(String title, String developer, String releaseDate,String coverImage, List<Genre> genres) {
        this.title = title;
        this.developer = developer;
        this.releaseDate = releaseDate;
        this.coverImage = coverImage;
        this.genres = genres;
    }
}