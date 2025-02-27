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


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VideoRepository videoRepository;
    private final WatchedVideoService watchedVideoService;


    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, VideoRepository videoRepository, WatchedVideoService watchedVideoService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.videoRepository = videoRepository;
        this.watchedVideoService = watchedVideoService;
    }


    public User addUser(User user) {
        return userRepository.save(user);
    }

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Collections.singleton(Role.USER));
        return userRepository.save(user);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAllUsers() {
        List<User> allUsers = userRepository.findAll();
        allUsers.forEach(user -> user.setPassword(null));
        return allUsers;
    }

    public Optional<User> getUserById(String id) {
        Optional<User> user = userRepository.findById(id);
        user.ifPresent(value -> value.setPassword(null));
        return user;
    }

    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    public void updateUser(User user) {
        User existingUser = userRepository.findById(user.getId()).orElse(null);
        if (existingUser == null) {
            return;
        }
        user.setPassword(existingUser.getPassword());
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

        // Check if the user has watched the video today
        if (watchedVideoService.hasUserWatchedVideoToday(userId, video.getId())) {
            // Already watched today, no need to increment count
            user.setLastWatchedVideo(video);
            userRepository.save(user);
            return;
        }
        watchedVideoService.addUserWatchedVideo(userId, video.getId());

        int totalViewTime = Math.toIntExact(user.getTotalViewTime() != null ? user.getTotalViewTime() : 0L);
        int totalVideosWatched = user.getTotalVideosWatched();

        user.setLastWatchedVideo(video);
        user.setTotalViewTime(totalViewTime + video.getDuration());
        user.setTotalVideosWatched(totalVideosWatched + 1);

        userRepository.save(user);
    }

    public void addWatchTime(String userId, int watchedTime) {
        User existingUser = userRepository.findById(userId).orElse(null);
        if (existingUser == null) {
            return;
        }

        // Accumulate watch time
        long currentWatchTime = existingUser.getTotalViewTime() != null ? existingUser.getTotalViewTime() : 0L;
        existingUser.setTotalViewTime(currentWatchTime + watchedTime);

        System.out.println("Adding watch time: " + watchedTime + " to user: " + existingUser.getEmail());
        userRepository.save(existingUser);
    }


}
