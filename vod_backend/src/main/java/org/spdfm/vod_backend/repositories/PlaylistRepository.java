package org.spdfm.vod_backend.repositories;

import org.spdfm.vod_backend.models.Playlist;
import org.spdfm.vod_backend.models.Video;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PlaylistRepository extends MongoRepository<Playlist, String> {
    List<Playlist> findByTitleContainingIgnoreCase(String title);
}
