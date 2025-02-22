package org.spdfm.vod_backend.utilities;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.spdfm.vod_backend.models.User;
import org.spdfm.vod_backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Collections;

@Configuration
public class DatabaseSeeder {

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    /*
    * TODO: REMOVE THIS METHOD AFTER DEVELOPMENT!
    * */
    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
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
        };
    }
}
