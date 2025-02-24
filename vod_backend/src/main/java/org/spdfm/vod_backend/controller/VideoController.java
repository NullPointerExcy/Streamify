package org.spdfm.vod_backend.controller;

import org.spdfm.vod_backend.models.Video;
import org.spdfm.vod_backend.services.ConfigService;
import org.spdfm.vod_backend.services.FFmpegService;
import org.spdfm.vod_backend.services.VideoService;
import org.spdfm.vod_backend.config.RabbitMQConfig;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private ConfigService configService;

    @Autowired
    private FFmpegService ffmpegService;

    @Autowired
    private AmqpTemplate rabbitTemplate;

    private String getStoragePath() {
        return configService.getConfigByKey("video.storage.locations").getValue();
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
        Video v = videoService.addVideo(video);
        // Rename video file to include video id {id}.mp4 / {id}.webm / {id}.mkv etc.
        String oldPath = video.getFilePath();
        // Create subdirectory for video with the videos id
        String path = Paths.get(oldPath).getParent().toString();
        String baseDir = path + "/" + v.getId() + "/";

        try {
            Files.createDirectories(Paths.get(baseDir));
        } catch (Exception e) {
            throw new RuntimeException("Video directory creation failed!", e);
        }

        String extension = oldPath.substring(oldPath.lastIndexOf("."));
        String newPath = baseDir + v.getId() + extension;
        try {
            Files.move(Paths.get(oldPath), Paths.get(newPath), StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception e) {
            throw new RuntimeException("Video file renaming failed!", e);
        }
        v.setFilePath(newPath);

        String outputDir = baseDir + "hls/";
        String storagePath = getStoragePath();
        ffmpegService.encodeToHLS(v.getGame().getId(), v.getId(), outputDir, storagePath);

        return videoService.addVideo(v);
    }

    @PostMapping("/upload/{id}")
    public String uploadVideo(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        try {
            LocalDateTime now = LocalDateTime.now();
            String baseDir = getStoragePath();
            String uploadDir = baseDir + id + "/";

            String originalFilename = file.getOriginalFilename();
            Path path = Paths.get(uploadDir, originalFilename).normalize();

            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            return path.toString().replace("\\", "/");
        } catch (Exception e) {
            throw new RuntimeException("Video upload failed!", e);
        }
    }

    @PutMapping("/{id}/view")
    public Video incrementViewerCount(@PathVariable String id) {
        return videoService.incrementViewerCount(id);
    }

    @PutMapping("/{id}")
    public Video updateVideo(@PathVariable String id, @RequestBody Video video) {
        Video existingVideo = videoService.getVideoById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        existingVideo.setTitle(video.getTitle());
        existingVideo.setDescription(video.getDescription());
        existingVideo.setFilePath(video.getFilePath());
        existingVideo.setThumbnail(video.getThumbnail());
        existingVideo.setDuration(video.getDuration());
        existingVideo.setGame(video.getGame());
        existingVideo.setViewerCount(video.getViewerCount());
        return videoService.addVideo(existingVideo);
    }

    @DeleteMapping("/{id}")
    public void deleteVideo(@PathVariable String id) {
        String baseDir = getStoragePath() + id;
        try {
            Files.deleteIfExists(Paths.get(baseDir));
        } catch (Exception e) {
            throw new RuntimeException("Video deletion failed!", e);
        }
        videoService.deleteVideo(id);
    }
}