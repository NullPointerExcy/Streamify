package org.spdfm.vod_backend.services;

import org.spdfm.vod_backend.models.Role;
import org.spdfm.vod_backend.models.User;
import org.spdfm.vod_backend.models.Video;
import org.spdfm.vod_backend.repositories.UserRepository;
import org.spdfm.vod_backend.repositories.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private VideoRepository videoRepository;

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Collections.singleton(Role.USER));
        return userRepository.save(user);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    public void updateUser(User user) {
        userRepository.save(user);
    }

    public void addWatchedVideo(String userId, Video v) {
        Optional<Video> videoOpt = videoRepository.findById(v.getId());
        Optional<User> userOpt = userRepository.findById(userId);

        if (videoOpt.isEmpty() || userOpt.isEmpty()) {
            return;
        }

        Video video = videoOpt.get();
        User user = userOpt.get();

        Set<Video> watchedVideos = Objects.requireNonNullElse(user.getWatchedVideos(), Collections.emptySet());

        if (watchedVideos.contains(video)) {
            user.setLastWatchedVideo(video);
            userRepository.save(user);
            // Video already watched, no other action needed
            return;
        }

        int totalViewTime = Math.toIntExact(Objects.requireNonNullElse(user.getTotalViewTime(), 0L));
        int totalVideosWatched = Objects.requireNonNullElse(user.getTotalVideosWatched(), 0);

        user.setLastWatchedVideo(video);
        user.setTotalViewTime(totalViewTime + video.getDuration());
        user.setTotalVideosWatched(totalVideosWatched + 1);

        if (watchedVideos.isEmpty()) {
            watchedVideos = new HashSet<>();
            user.setWatchedVideos(watchedVideos);
        }

        watchedVideos.add(video);
        userRepository.save(user);
    }

}
