package org.spdfm.vod_backend.services;

import org.spdfm.vod_backend.models.GuestView;
import org.spdfm.vod_backend.repositories.GuestViewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class GuestViewService {

    @Autowired
    private GuestViewRepository guestViewRepository;

    public boolean hasGuestWatchedVideo(String ipAddress, String videoId) {
        Optional<GuestView> existingView = guestViewRepository.findByIpAddressAndVideoId(ipAddress, videoId);
        if (existingView.isPresent()) {
            LocalDateTime lastViewed = existingView.get().getViewedAt();
            // Allow repeated views after 48 hours
            return lastViewed.isAfter(LocalDateTime.now().minusHours(48));
        }
        return false;
    }

    public void addGuestView(String ipAddress, String videoId) {
        if (!hasGuestWatchedVideo(ipAddress, videoId)) {
            GuestView guestView = new GuestView(ipAddress, videoId);
            guestViewRepository.save(guestView);
        }
    }

    public List<GuestView> findAll() {
        return guestViewRepository.findAll();
    }
}
