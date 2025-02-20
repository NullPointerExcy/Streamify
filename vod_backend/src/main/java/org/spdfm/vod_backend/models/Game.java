package org.spdfm.vod_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "games")
public class Game {

    @Id
    private String id;

    private String title;
    private String developer;
    private String releaseDate;

    @DBRef
    private Genre genre;

    // Constructor
    public Game(String title, String developer, String releaseDate, Genre genre) {
        this.title = title;
        this.developer = developer;
        this.releaseDate = releaseDate;
        this.genre = genre;
    }
}