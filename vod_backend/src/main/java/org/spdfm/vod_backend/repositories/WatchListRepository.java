package org.spdfm.vod_backend.repositories;

import org.spdfm.vod_backend.models.WatchList;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface WatchListRepository extends MongoRepository<WatchList, String> {
    List<WatchList> findByUserId(String userId);
    Optional<WatchList> findByUserIdAndVideoId(String userId, String videoId);
    void deleteByUserIdAndVideoId(String userId, String videoId);
}
