package org.spdfm.vod_backend.services;

import org.spdfm.vod_backend.models.Video;
import org.spdfm.vod_backend.models.WatchList;
import org.spdfm.vod_backend.repositories.VideoRepository;
import org.spdfm.vod_backend.repositories.WatchListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class WatchListService {

    @Autowired
    private WatchListRepository watchListRepository;

    @Autowired
    private VideoRepository videoRepository;

    public List<Video> getWatchListByUserId(String userId) {
        List<WatchList> watchListEntries = watchListRepository.findByUserId(userId);
        return watchListEntries.stream()
                .map(watchList -> videoRepository.findById(watchList.getVideoId()).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public void addToWatchList(String userId, String videoId) {
        if (watchListRepository.findByUserIdAndVideoId(userId, videoId).isEmpty()) {
            WatchList watchList = new WatchList(userId, videoId);
            watchListRepository.save(watchList);
        }
    }

    public void removeFromWatchList(String userId, String videoId) {
        watchListRepository.deleteByUserIdAndVideoId(userId, videoId);
    }
}
