package org.spdfm.vod_backend.services;

import org.spdfm.vod_backend.models.BackgroundImage;
import org.spdfm.vod_backend.repositories.BackgroundImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BackgroundImageService {

    @Autowired
    private BackgroundImageRepository backgroundImageRepository;

    public List<BackgroundImage> getAllBackgroundImages() {
        return backgroundImageRepository.findAll();
    }

    public Optional<BackgroundImage> getBackgroundImageById(String id) {
        return backgroundImageRepository.findById(id);
    }

    public BackgroundImage addBackgroundImage(BackgroundImage backgroundImage) {
        return backgroundImageRepository.save(backgroundImage);
    }

    public BackgroundImage updateBackgroundImage(String id, BackgroundImage backgroundImage) {
        backgroundImage.setId(id);
        return backgroundImageRepository.save(backgroundImage);
    }

    public void deleteBackgroundImage(String id) {
        backgroundImageRepository.deleteById(id);
    }
}
