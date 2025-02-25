package org.spdfm.vod_backend.controllers;

import org.spdfm.vod_backend.models.Video;
import org.spdfm.vod_backend.services.WatchedVideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/watched-videos")
public class WatchedVideoController {

    @Autowired
    private WatchedVideoService watchedVideoService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Video>> getWatchedVideosByUser(@PathVariable String userId) {
        List<Video> watchedVideos = watchedVideoService.getWatchedVideosByUserId(userId);
        return ResponseEntity.ok(watchedVideos);
    }
}
