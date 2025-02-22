package org.spdfm.vod_backend.controller;

import org.spdfm.vod_backend.models.Video;
import org.spdfm.vod_backend.services.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/videos")
public class VideoController {

    @Autowired
    private VideoService videoService;

    @Value("${video.storage.locations}")
    private String[] storageLocations;

    private String getStoragePath(String id) {
        int index = Math.abs(id.hashCode()) % storageLocations.length;
        return storageLocations[index];
    }

    @GetMapping
    public List<Video> getAllVideos() {
        return videoService.getAllVideos();
    }

    @GetMapping("/{id}")
    public Optional<Video> getVideoById(@PathVariable String id) {
        return videoService.getVideoById(id);
    }

    @PostMapping
    public Video addVideo(@RequestBody Video video) {
        return videoService.addVideo(video);
    }

    @PostMapping("/upload/{id}")
    public String uploadVideo(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        try {
            LocalDateTime now = LocalDateTime.now();
            String baseDir = getStoragePath(id);
            String uploadDir = baseDir + "/" + id + "/" + now.getYear() + "/" + now.getMonthValue() + "/";
            Path path = Paths.get(uploadDir + file.getOriginalFilename());
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());
            return path.toString();
        } catch (Exception e) {
            throw new RuntimeException("Video upload failed!", e);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteVideo(@PathVariable String id) {
        videoService.deleteVideo(id);
    }
}