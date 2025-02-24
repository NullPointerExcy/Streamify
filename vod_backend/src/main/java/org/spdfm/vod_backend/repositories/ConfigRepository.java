package org.spdfm.vod_backend.repositories;

import org.spdfm.vod_backend.models.Config;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ConfigRepository extends MongoRepository<Config, String> {
    Config findByKey(String key);
}
