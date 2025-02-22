package org.spdfm.vod_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "genres")
public class Genre {

    @Id
    private String id;

    private String name;
    private String description;
    private String color;

    public Genre(String name, String description, String color) {
        this.name = name;
        this.description = description;
        this.color = color;
    }
}