package org.spdfm.vod_backend.repositories;

import org.spdfm.vod_backend.models.WatchedVideo;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface WatchedVideoRepository extends MongoRepository<WatchedVideo, String> {
    List<WatchedVideo> findByUserIdAndVideoId(String userId, String videoId);
    List<WatchedVideo> findByUserId(String userId);
    List<WatchedVideo> findByUserIdOrderByWatchedAtDesc(String videoId);
}
