package org.spdfm.vod_backend.controller;

import org.spdfm.vod_backend.models.Playlist;
import org.spdfm.vod_backend.services.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/playlists")
public class PlaylistController {

    @Autowired
    private PlaylistService playlistService;

    @GetMapping
    public List<Playlist> getAllPlaylists() {
        return playlistService.getAllPlaylists();
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

    @PutMapping("/{playlistId}/videos/{videoId}")
    public void addVideoToPlaylist(@PathVariable String playlistId, @PathVariable String videoId) {
        playlistService.addVideoToPlaylist(playlistId, videoId);
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
