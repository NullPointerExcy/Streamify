package org.spdfm.vod_backend.models;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@Document(collection = "configs")
public class Config {
    @Id
    private String key;
    private String value;

    public Config(String key, String value) {
        this.key = key;
        this.value = value;
    }
}
