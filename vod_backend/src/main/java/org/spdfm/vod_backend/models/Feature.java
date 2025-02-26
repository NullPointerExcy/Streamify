package org.spdfm.vod_backend.models;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Data
@Document(collection = "features")
public class Feature {

    @Id
    private String id;

    private String title;
    private String description;
    private Boolean enabled;

    private String roleRestriction;

    @DBRef
    private Set<User> allowedUsers;

    public Feature(String title, String description, Boolean enabled, String roleRestriction, Set<User> allowedUsers) {
        this.title = title;
        this.description = description;
        this.enabled = enabled;
        this.roleRestriction = roleRestriction;
        this.allowedUsers = allowedUsers;
    }
}
