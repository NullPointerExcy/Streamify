package org.spdfm.vod_backend.controller;

import org.spdfm.vod_backend.models.Video;
import org.spdfm.vod_backend.services.WatchListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/watchlists")
public class WatchListController {

    @Autowired
    private WatchListService watchListService;

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<Video>> getWatchListByUser(@PathVariable String userId) {
        List<Video> watchList = watchListService.getWatchListByUserId(userId);
        return ResponseEntity.ok(watchList);
    }

    @PostMapping("/users/{userId}/{videoId}")
    public ResponseEntity<String> addToWatchList(@PathVariable String userId, @PathVariable String videoId) {
        watchListService.addToWatchList(userId, videoId);
        return ResponseEntity.ok("Added to watch list");
    }

    @DeleteMapping("/users/{userId}/{videoId}")
    public ResponseEntity<String> removeFromWatchList(@PathVariable String userId, @PathVariable String videoId) {
        watchListService.removeFromWatchList(userId, videoId);
        return ResponseEntity.ok("Removed from watch list");
    }
}
