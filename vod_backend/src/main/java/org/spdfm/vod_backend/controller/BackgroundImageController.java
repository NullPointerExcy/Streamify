package org.spdfm.vod_backend.controller;

import org.spdfm.vod_backend.models.BackgroundImage;
import org.spdfm.vod_backend.services.BackgroundImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/v1/background-images")
public class BackgroundImageController {

    @Autowired
    private BackgroundImageService backgroundImageService;

    @GetMapping
    public List<BackgroundImage> getAllBackgroundImages() {
        return backgroundImageService.getAllBackgroundImages();
    }

    @GetMapping("/{id}")
    public Optional<BackgroundImage> getBackgroundImageById(@PathVariable String id) {
        return backgroundImageService.getBackgroundImageById(id);
    }

    @PostMapping("/upload-background")
    public Map<String, String> uploadBackgroundImage(@RequestParam("file") MultipartFile file) {
        try {
            byte[] imageBytes = file.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            String dataUrl = "data:" + file.getContentType() + ";base64," + base64Image;

            Map<String, String> response = new HashMap<>();
            response.put("imageData", dataUrl);
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Background upload failed!", e);
        }
    }

    @PostMapping
    public BackgroundImage addBackgroundImage(@RequestBody BackgroundImage backgroundImage) {
        return backgroundImageService.addBackgroundImage(backgroundImage);
    }

    @PutMapping("/{id}")
    public BackgroundImage updateBackgroundImage(@PathVariable String id, @RequestBody BackgroundImage backgroundImage) {
        return backgroundImageService.updateBackgroundImage(id, backgroundImage);
    }

    @DeleteMapping("/{id}")
    public void deleteBackgroundImage(@PathVariable String id) {
        backgroundImageService.deleteBackgroundImage(id);
    }
}
