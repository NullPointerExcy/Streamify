package org.spdfm.vod_backend.config;

import org.spdfm.vod_backend.models.Config;
import org.spdfm.vod_backend.services.ConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
    private ConfigService configService;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        List<String> locations = getStreamLocations();
        for (String location : locations) {
            if (!location.startsWith("file:")) location = "file:" + location;
            if (!location.endsWith("/")) location += "/";

            registry.addResourceHandler("/videos/**", "/video/stream/**")
                    .addResourceLocations(location)
                    .setCachePeriod(3600)
                    .resourceChain(true);
        }
    }

    private List<String> getStreamLocations() {
        try {
            Config config = configService.getConfigByKey("web.stream.resource.locations");
            if (config != null && config.getValue() != null) {
                List<String> streamLocations = new ArrayList<>(List.of(config.getValue().split(",")));
                streamLocations.replaceAll(s -> s.endsWith("/") ? s + "**" : s + "/**");
                streamLocations.add("/videos/**");
                return streamLocations;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ArrayList<>();
    }

}
