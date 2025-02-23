package org.spdfm.vod_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${web.stream.resource.locations}")
    private String resourceLocations;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String[] locations = resourceLocations.split(",");
        for (int i = 0; i < locations.length; i++) {
            if (!locations[i].startsWith("file:")) locations[i] = "file:" + locations[i];
            if (!locations[i].endsWith("/")) locations[i] += "/";
        }
        registry.addResourceHandler("/videos/**")
                .addResourceLocations(locations)
                .setCachePeriod(3600)
                .resourceChain(true);
    }
}
