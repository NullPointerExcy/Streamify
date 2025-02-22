package org.spdfm.vod_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "background_images")
public class BackgroundImage {

    @Id
    private String id;

    private String imageUrl;

    private String name;
    private String description;
    private Boolean isDefault = false;

    public BackgroundImage() {
    }

    public BackgroundImage(String imageUrl, String name, String description, Boolean isDefault) {
        this.imageUrl = imageUrl;
        this.name = name;
        this.description = description;
        this.isDefault = isDefault;
    }
}
