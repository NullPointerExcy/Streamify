package org.spdfm.vod_backend.repositories;

import org.spdfm.vod_backend.models.BackgroundImage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BackgroundImageRepository extends MongoRepository<BackgroundImage, String> {
}
