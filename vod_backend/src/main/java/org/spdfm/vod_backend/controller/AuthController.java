package org.spdfm.vod_backend.controller;

import org.spdfm.vod_backend.models.User;
import org.spdfm.vod_backend.utilities.JwtTokenUtil;
import org.spdfm.vod_backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
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
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        return userService.getUserByEmail(user.getEmail())
                .filter(u -> new BCryptPasswordEncoder().matches(user.getPassword(), u.getPassword()))
                .map(u -> ResponseEntity.ok(jwtTokenUtil.generateToken(u.getEmail())))
                .orElse(ResponseEntity.status(401).body("Invalid credentials"));
    }
}