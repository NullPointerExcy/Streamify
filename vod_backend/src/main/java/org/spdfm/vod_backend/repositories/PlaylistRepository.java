package org.spdfm.vod_backend.repositories;

import org.spdfm.vod_backend.models.Playlist;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PlaylistRepository extends MongoRepository<Playlist, String> {
    List<Playlist> findByTitleContainingIgnoreCase(String title);
}
