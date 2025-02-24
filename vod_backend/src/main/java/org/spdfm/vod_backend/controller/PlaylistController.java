package org.spdfm.vod_backend.controller;

import org.spdfm.vod_backend.models.Playlist;
import org.spdfm.vod_backend.services.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/v1/playlists")
public class PlaylistController {

    @Autowired
    private PlaylistService playlistService;

    @GetMapping
    public List<Playlist> getAllPlaylists() {
        List<Playlist> playlists = playlistService.getAllPlaylists();
        playlists.forEach(playlist -> {
            if (playlist.getThumbnail() != null && !playlist.getThumbnail().startsWith("http")) {
                playlist.setThumbnail(playlist.getThumbnail());
            }
        });
        return playlists;
    }

    @GetMapping("/{id}")
    public Optional<Playlist> getPlaylistById(@PathVariable String id) {
        return playlistService.getPlaylistById(id);
    }

    @PostMapping
    public Playlist addPlaylist(@RequestBody Playlist playlist) {
        return playlistService.addPlaylist(playlist);
    }

    @PutMapping("/{id}")
    public Playlist updatePlaylist(@PathVariable String id, @RequestBody Playlist playlist) {
        return playlistService.updatePlaylist(id, playlist);
    }

    @PostMapping("/upload-cover")
    public Map<String, String> uploadCover(@RequestParam("file") MultipartFile file) {
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

    @PutMapping("/{playlistId}/videos/{videoId}")
    public void addVideoToPlaylist(@PathVariable String playlistId, @PathVariable String videoId) {
        playlistService.addVideoToPlaylist(playlistId, videoId);
    }

    @PutMapping("/{playlistId}/videos")
    public Playlist updatePlaylistVideos(@PathVariable String playlistId,
                                         @RequestBody List<String> videoIds) {
        return playlistService.updatePlaylistVideos(playlistId, videoIds);
    }

    @DeleteMapping("/{playlistId}/videos/{videoId}")
    public void removeVideoFromPlaylist(@PathVariable String playlistId, @PathVariable String videoId) {
        playlistService.removeVideoFromPlaylist(playlistId, videoId);
    }

    @DeleteMapping("/{id}")
    public void deletePlaylist(@PathVariable String id) {
        playlistService.deletePlaylist(id);
    }
}
