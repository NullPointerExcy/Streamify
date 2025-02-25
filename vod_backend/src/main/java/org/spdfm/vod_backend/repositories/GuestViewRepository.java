package org.spdfm.vod_backend.repositories;

import org.spdfm.vod_backend.models.GuestView;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface GuestViewRepository extends MongoRepository<GuestView, String> {
    Optional<GuestView> findByIpAddressAndVideoId(String ipAddress, String videoId);
    Optional<GuestView> findByIpAddress(String ipAddress);
}
