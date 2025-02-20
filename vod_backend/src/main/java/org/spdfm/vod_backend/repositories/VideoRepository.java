package org.spdfm.vod_backend.repositories;

import org.spdfm.vod_backend.models.Video;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface VideoRepository extends MongoRepository<Video, String> {
    List<Video> findByTitleContainingIgnoreCase(String title);
}