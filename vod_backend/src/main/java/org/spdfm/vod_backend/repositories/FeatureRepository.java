package org.spdfm.vod_backend.repositories;

import org.spdfm.vod_backend.models.Feature;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FeatureRepository  extends MongoRepository<Feature, String> {
}
