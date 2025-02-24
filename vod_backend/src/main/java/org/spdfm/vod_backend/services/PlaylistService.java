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
        return playlistRepository.findById(id);
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
        existingPlaylist.setThumbnail(playlist.getThumbnail());
        return playlistRepository.save(existingPlaylist);
    }

    public void addVideoToPlaylist(String playlistId, String videoId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));
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

    public Playlist updatePlaylistVideos(String playlistId, List<String> videoIds) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));
        List<Video> videos = videoRepository.findAllById(videoIds);
        playlist.setVideos(videos);
        return playlistRepository.save(playlist);
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
