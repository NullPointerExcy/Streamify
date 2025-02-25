package org.spdfm.vod_backend.services;

import org.spdfm.vod_backend.models.Video;
import org.spdfm.vod_backend.models.WatchedVideo;
import org.spdfm.vod_backend.repositories.VideoRepository;
import org.spdfm.vod_backend.repositories.WatchedVideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WatchedVideoService {

    @Autowired
    private WatchedVideoRepository watchedVideoRepository;

    @Autowired
    private VideoRepository videoRepository;

    public List<Video> getWatchedVideosByUserId(String userId) {
        List<WatchedVideo> watchedVideos = watchedVideoRepository.findByUserIdOrderByWatchedAtDesc(userId);

        // Get the video details for each watched video
        return watchedVideos.stream()
                .map(watchedVideo -> videoRepository.findById(watchedVideo.getVideoId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }

    public boolean hasUserWatchedVideoToday(String userId, String videoId) {
        List<WatchedVideo> watchedVideos = watchedVideoRepository.findByUserIdAndVideoId(userId, videoId);
        return watchedVideos.stream().anyMatch(wv ->
                wv.getWatchedAt().toLocalDate().isEqual(LocalDateTime.now().toLocalDate())
        );
    }

    public void addUserWatchedVideo(String userId, String videoId) {
        if (!hasUserWatchedVideoToday(userId, videoId)) {
            WatchedVideo watchedVideo = new WatchedVideo(userId, videoId);
            watchedVideoRepository.save(watchedVideo);
        }
    }
}
