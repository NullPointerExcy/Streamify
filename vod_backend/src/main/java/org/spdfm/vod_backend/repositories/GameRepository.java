package org.spdfm.vod_backend.repositories;

import org.spdfm.vod_backend.models.Game;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GameRepository extends MongoRepository<Game, String> {
    List<Game> findByTitleContainingIgnoreCase(String title);
}
