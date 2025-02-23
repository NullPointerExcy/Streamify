package org.spdfm.vod_backend.config;

import org.spdfm.vod_backend.filters.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Value("${cors.allowed.origins}")
    private String allowedOrigins;

    @Value("${web.stream.resource.locations}")
    private String streamResourceLocations;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        List<String> origins = List.of(this.allowedOrigins.split(","));
        List<String> streamLocations = new java.util.ArrayList<>(List.of(this.streamResourceLocations.split(",")));

        streamLocations.replaceAll(s -> s + "**");
        streamLocations.add("/videos/**");
        streamLocations.add("/api/v1/videos/**");
        streamLocations.add("/api/v1/playlists/**");
        streamLocations.add("/api/v1/topics/**");
        streamLocations.add("/api/v1/settings/**");
        streamLocations.add("/api/v1/comments/**");
        streamLocations.add("/api/v1/auth/**");

        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                    corsConfig.setAllowedOrigins(origins);
                    corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    corsConfig.setAllowedHeaders(List.of("*"));
                    corsConfig.setAllowCredentials(true);
                    return corsConfig;
                }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/videos/**",
                                "/api/v1/videos/**",
                                "/api/v1/playlists/**",
                                "/api/v1/topics/**",
                                "/api/v1/settings/**",
                                "/api/v1/comments/**",
                                "/api/v1/auth/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
