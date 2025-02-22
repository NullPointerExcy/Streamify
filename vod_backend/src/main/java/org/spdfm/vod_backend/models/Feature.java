package org.spdfm.vod_backend.models;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "features")
public class Feature {

    @Id
    private String id;

    private String title;
    private String description;
    private Boolean enabled;

    public Feature(String title, String description, Boolean enabled) {
        this.title = title;
        this.description = description;
        this.enabled = enabled;
    }
}
