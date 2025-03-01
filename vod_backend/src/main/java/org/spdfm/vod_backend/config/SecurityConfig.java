package org.spdfm.vod_backend.config;

import org.spdfm.vod_backend.filters.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

    private final JwtRequestFilter jwtRequestFilter;

    @Value("${cors.allowed.origins}")
    private String allowedOrigins;

    @Autowired
    public SecurityConfig(JwtRequestFilter jwtRequestFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        List<String> origins = List.of(this.allowedOrigins.split(","));
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                    corsConfig.setAllowedOrigins(origins);
                    corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    corsConfig.setAllowedHeaders(List.of("Content-Type", "Authorization", "X-Requested-With", "X-XSRF-TOKEN"));
                    corsConfig.setExposedHeaders(List.of("Content-Type", "Authorization"));
                    corsConfig.setAllowCredentials(true);
                    return corsConfig;
                }))
                .authorizeHttpRequests(auth -> auth
                        // Public Endpoints
                        .requestMatchers(HttpMethod.OPTIONS).permitAll()

                        // Auth Endpoints
                        .requestMatchers(HttpMethod.POST,
                                "/api/v1/auth/**",
                                "/api/v1/auth/login",
                                "/api/v1/users/register"
                        ).permitAll()

                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/videos/**",
                                "/api/v1/playlists/**",
                                "/api/v1/games/**",
                                "/api/v1/background-images/**",
                                "/api/v1/configs/**",
                                "/api/v1/genres/**",
                                "/api/v1/settings/**",
                                "/api/v1/users/**",
                                "/api/v1/users/user-image/**",
                                "/api/v1/features/**",
                                "/api/v1/comments/**",
                                "/api/v1/topics/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/users/addWatchedVideo/**",
                                "/api/v1/watchlists/users/**"
                        ).hasAnyAuthority("ROLE_ADMIN", "ROLE_MODERATOR", "ROLE_USER")

                        .requestMatchers(HttpMethod.PUT, "/api/v1/users/addWatchedVideo/**").permitAll()

                        // Admin/Moderator Endpoints
                        .requestMatchers(HttpMethod.POST, "/api/v1/videos/upload/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_MODERATOR")
                        .requestMatchers(HttpMethod.PUT,
                                "/api/v1/playlists/**",
                                "/api/v1/videos/**",
                                "/api/v1/features/**",
                                "/api/v1/settings/**",
                                "/api/v1/games/**",
                                "/api/v1/background-images/**",
                                "/api/v1/configs/**",
                                "/api/v1/genres/**"
                        ).hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST,
                                "/api/v1/playlists/**",
                                "/api/v1/videos/**",
                                "/api/v1/features/**",
                                "/api/v1/settings/**",
                                "/api/v1/games/**",
                                "/api/v1/background-images/**",
                                "/api/v1/configs/**",
                                "/api/v1/genres/**"
                        ).hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE,
                                "/api/v1/playlists/**",
                                "/api/v1/videos/**",
                                "/api/v1/features/**",
                                "/api/v1/settings/**",
                                "/api/v1/games/**",
                                "/api/v1/background-images/**",
                                "/api/v1/genres/**"
                        ).hasAuthority("ROLE_ADMIN")

                        // Community Endpoints
                        .requestMatchers(HttpMethod.PUT,
                                "/api/v1/comments/**",
                                "/api/v1/topics/**"
                        ).hasAnyAuthority("ROLE_ADMIN", "ROLE_MODERATOR", "ROLE_USER")
                        .requestMatchers(HttpMethod.POST,
                                "/api/v1/comments/**",
                                "/api/v1/topics/**"
                        ).hasAnyAuthority("ROLE_ADMIN", "ROLE_MODERATOR", "ROLE_USER")
                        .requestMatchers(HttpMethod.DELETE,
                                "/api/v1/comments/**",
                                "/api/v1/topics/**"
                        ).hasAnyAuthority("ROLE_ADMIN", "ROLE_MODERATOR", "ROLE_USER")

                        // User Endpoints
                        .requestMatchers(HttpMethod.PUT, "/api/v1/users/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_MODERATOR", "ROLE_USER")
                        .requestMatchers(HttpMethod.POST, "/api/v1/users/upload-user-image")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_MODERATOR", "ROLE_USER")
                        .requestMatchers(HttpMethod.POST, "/api/v1/users/**")
                        .hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/users/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_MODERATOR")

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