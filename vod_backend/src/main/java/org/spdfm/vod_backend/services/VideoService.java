package org.spdfm.vod_backend.services;

import org.spdfm.vod_backend.models.Playlist;
import org.spdfm.vod_backend.models.Video;
import org.spdfm.vod_backend.repositories.PlaylistRepository;
import org.spdfm.vod_backend.repositories.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private PlaylistRepository playlistRepository;


    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    public Optional<Video> getVideoById(String id) {
        return videoRepository.findById(id);
    }

    public Video addVideo(Video video) {
        return videoRepository.save(video);
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

    public Video incrementViewerCount(String id) {
        Optional<Video> optionalVideo = videoRepository.findById(id);
        if (optionalVideo.isPresent()) {
            Video video = optionalVideo.get();
            Long viewerCount = video.getViewerCount();
            if (viewerCount == null) {
                viewerCount = 0L;
            }
            video.setViewerCount(viewerCount + 1);
            return videoRepository.save(video);
        }
        return null;
    }

    public void deleteVideo(String id) {
        videoRepository.deleteById(id);
    }

}
