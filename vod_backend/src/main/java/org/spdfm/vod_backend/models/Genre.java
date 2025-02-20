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

    public Genre(String name, String description) {
        this.name = name;
        this.description = description;
    }
}