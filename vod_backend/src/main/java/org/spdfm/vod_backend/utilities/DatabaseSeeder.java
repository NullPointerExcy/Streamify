package org.spdfm.vod_backend.utilities;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.spdfm.vod_backend.models.Game;
import org.spdfm.vod_backend.models.Genre;
import org.spdfm.vod_backend.models.User;
import org.spdfm.vod_backend.repositories.GameRepository;
import org.spdfm.vod_backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Configuration
public class DatabaseSeeder {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GameRepository gameRepository;

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            /*
             * TODO: REMOVE THIS METHOD AFTER DEVELOPMENT!
             * */
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setEmail("admin@example.com");
                admin.setName("Admin");
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                admin.setPassword(encoder.encode("admin"));
                admin.setRoles(Collections.singleton(org.spdfm.vod_backend.models.Role.ADMIN));
                userRepository.save(admin);
                System.out.println("Admin User created!");
            }

            // Fallback Game, if connection to Playlist / Video breaks
            List<Genre> genres = new ArrayList<>();
            Game game = new Game("Unknown", "Unknown", "Unknown", "", genres);
            if (gameRepository.findByTitle(game.getTitle()).isEmpty()) {
                gameRepository.save(game);
            }
        };
    }
}
