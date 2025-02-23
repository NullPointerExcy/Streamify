package org.spdfm.vod_backend.services;

import org.spdfm.vod_backend.models.Playlist;
import org.spdfm.vod_backend.models.Video;
import org.spdfm.vod_backend.repositories.PlaylistRepository;
import org.spdfm.vod_backend.repositories.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlaylistService {

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private VideoRepository videoRepository;

    public List<Playlist> getAllPlaylists() {
        return playlistRepository.findAll();
    }


    public Optional<Playlist> getPlaylistById(String id) {
        Optional<Playlist> optionalPlaylist = playlistRepository.findById(id);
        if (optionalPlaylist.isPresent()) {
            Playlist playlist = optionalPlaylist.get();
            if (playlist.getVideos() != null) {
                List<Video> resolvedVideos = playlist.getVideos().stream()
                        .map(video -> videoRepository.findById(video.getId()).orElse(null))
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
                playlist.setVideos(resolvedVideos);
            }
            return Optional.of(playlist);
        }
        return Optional.empty();
    }


    public Playlist addPlaylist(Playlist playlist) {
        return playlistRepository.save(playlist);
    }

    public Playlist updatePlaylist(String id, Playlist playlist) {
        Playlist existingPlaylist = playlistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));
        existingPlaylist.setId(existingPlaylist.getId());
        existingPlaylist.setTitle(playlist.getTitle());
        existingPlaylist.setDescription(playlist.getDescription());
        existingPlaylist.setVideos(playlist.getVideos());
        return playlistRepository.save(existingPlaylist);
    }

    public void addVideoToPlaylist(String playlistId, String videoId) {
        Playlist playlist = getPlaylistById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));
        // videos are always null, even the DB entry has videos, and the frontend shows the videos
        // TODO: FIX THIS

        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));


        if (playlist.getVideos() == null) {
            playlist.setVideos(new ArrayList<>());
        }
        if (!playlist.getVideos().contains(video)) {
            playlist.getVideos().add(video);
        }
        playlistRepository.save(playlist);
    }

    public void removeVideoFromPlaylist(String playlistId, String videoId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        playlist.getVideos().removeIf(video -> video.getId().equals(videoId));
        playlistRepository.save(playlist);
    }

    public void deletePlaylist(String id) {
        playlistRepository.deleteById(id);
    }
}
