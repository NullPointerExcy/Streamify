package org.spdfm.vod_backend.repositories;

import org.spdfm.vod_backend.models.SiteSettings;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SiteSettingsRepository extends MongoRepository<SiteSettings, String> {

}
