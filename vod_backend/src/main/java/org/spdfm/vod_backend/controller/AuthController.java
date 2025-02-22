package org.spdfm.vod_backend.controller;

import org.spdfm.vod_backend.models.User;
import org.spdfm.vod_backend.services.UserService;
import org.spdfm.vod_backend.utilities.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userService.getUserByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody User user) {
        return userService.getUserByEmail(user.getEmail())
                .filter(u -> new BCryptPasswordEncoder().matches(user.getPassword(), u.getPassword()))
                .map(u -> {
                    String token = jwtTokenUtil.generateToken(u);
                    Map<String, Object> response = new HashMap<>();
                    response.put("token", token);

                    Map<String, Object> userDetails = new HashMap<>();
                    userDetails.put("id", u.getId());
                    userDetails.put("email", Optional.ofNullable(u.getEmail()).orElse("No Email"));
                    userDetails.put("name", Optional.ofNullable(u.getName()).orElse("Anonymous"));
                    userDetails.put("roles", Optional.ofNullable(u.getRoles()).orElse(Collections.emptySet()));
                    userDetails.put("userImage", Optional.ofNullable(u.getUserImage()).orElse("default.png"));

                    userDetails.put("totalViewTime", u.getTotalViewTime());
                    userDetails.put("totalVideosWatched", u.getTotalVideosWatched());
                    userDetails.put("totalCreatedTopics", u.getTotalCreatedTopics());
                    userDetails.put("totalComments", u.getTotalComments());
                    userDetails.put("topics", Optional.ofNullable(u.getTopics()).orElse(Collections.emptySet()));
                    userDetails.put("comments", Optional.ofNullable(u.getComments()).orElse(Collections.emptySet()));
                    userDetails.put("watchedVideos", Optional.ofNullable(u.getWatchedVideos()).orElse(Collections.emptySet()));
                    userDetails.put("lastWatchedVideo", Optional.ofNullable(u.getLastWatchedVideo()).orElse(null));

                    response.put("user", userDetails);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }
}
