package org.spdfm.vod_backend.services;

import org.spdfm.vod_backend.models.Video;
import org.spdfm.vod_backend.repositories.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    public Optional<Video> getVideoById(String id) {
        return videoRepository.findById(id);
    }

    public Video addVideo(Video video) {
        return videoRepository.save(video);
    }

    public void deleteVideo(String id) {
        videoRepository.deleteById(id);
    }
}
