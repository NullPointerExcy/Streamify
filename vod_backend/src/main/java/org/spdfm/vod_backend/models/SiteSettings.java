package org.spdfm.vod_backend.models;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Data
@Document(collection = "side_settings")
public class SiteSettings {

    @Id
    private String id;

    private String siteName;
    private String siteTitle;
    private String siteDescription;
    private Map<String, String> siteTheme;
    private String siteLogo;
    private String siteFavicon;
    private String siteLanguage;
    private Boolean isActive;
}