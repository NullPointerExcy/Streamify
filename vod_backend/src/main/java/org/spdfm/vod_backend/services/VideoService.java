package org.spdfm.vod_backend.services;

import jakarta.servlet.http.HttpServletRequest;
import org.spdfm.vod_backend.models.Playlist;
import org.spdfm.vod_backend.models.User;
import org.spdfm.vod_backend.models.Video;
import org.spdfm.vod_backend.repositories.PlaylistRepository;
import org.spdfm.vod_backend.repositories.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @Autowired
    private GuestViewService guestViewService;

    @Autowired
    private WatchedVideoService watchedVideoService;


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

    public Video incrementViewerCount(String id, String ipAddress) {
        Optional<Video> optionalVideo = videoRepository.findById(id);
        if (optionalVideo.isEmpty()) {
            return null;
        }

        Video video = optionalVideo.get();

        // Get the currently authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() &&
                authentication.getPrincipal() instanceof User) {

            // Registered user logic
            User userDetails = (User) authentication.getPrincipal();
            String userId = userDetails.getName();

            // Check if the user has already watched the video today
            if (!watchedVideoService.hasUserWatchedVideoToday(userId, id)) {
                watchedVideoService.addUserWatchedVideo(userId, id);
                incrementVideoViewCount(video);
            }
        } else {
            // Guest user logic
            if (!guestViewService.hasGuestWatchedVideo(ipAddress, id)) {
                guestViewService.addGuestView(ipAddress, id);
                incrementVideoViewCount(video);
            }
        }

        return video;
    }

    private void incrementVideoViewCount(Video video) {
        Long viewerCount = video.getViewerCount();
        if (viewerCount == null) {
            viewerCount = 0L;
        }
        video.setViewerCount(viewerCount + 1);
        videoRepository.save(video);
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    public void deleteVideo(String id) {
        videoRepository.deleteById(id);
    }

}
