package org.spdfm.vod_backend.controller;


import org.spdfm.vod_backend.models.User;
import org.spdfm.vod_backend.models.Video;
import org.spdfm.vod_backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @PutMapping
    public void updateUser(@RequestBody User user) {
        userService.updateUser(user);
    }

    @PutMapping("/addWatchedVideo/{userId}")
    public void addWatchedVideo(@PathVariable String userId, @RequestBody Video video) {
        userService.addWatchedVideo(userId, video);
    }

    @PutMapping("/addWatchTime")
    public void addWatchTime(@RequestBody Map<String, Object> payload) {
        String userId = (String) payload.get("id");
        Integer watchedTime = (Integer) payload.get("totalViewTime");
        System.out.println("userId: " + userId + " watchedTime: " + watchedTime);
        if (userId != null && watchedTime != null) {
            userService.addWatchTime(userId, watchedTime);
        }
    }


    @PostMapping("/upload-user-image")
    public Map<String, String> uploadUserImage(@RequestParam("file") MultipartFile file) {
        try {
            byte[] imageBytes = file.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            String dataUrl = "data:" + file.getContentType() + ";base64," + base64Image;

            Map<String, String> response = new HashMap<>();
            response.put("imageData", dataUrl);
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Cover upload failed!", e);
        }
    }

    @DeleteMapping
    public void deleteUser(@RequestBody User user) {
        userService.deleteUser(user);
    }

}
