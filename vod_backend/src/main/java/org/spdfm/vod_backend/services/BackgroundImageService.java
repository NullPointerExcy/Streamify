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

    public BackgroundImage updateBackgroundImage(BackgroundImage backgroundImage) {
        BackgroundImage existingBackgroundImage = backgroundImageRepository.findById(backgroundImage.getId()).orElse(null);
        if (existingBackgroundImage == null) {
            return null;
        }
        existingBackgroundImage.setName(backgroundImage.getName());
        existingBackgroundImage.setImageUrl(backgroundImage.getImageUrl());
        existingBackgroundImage.setIsDefault(backgroundImage.getIsDefault());
        return backgroundImageRepository.save(existingBackgroundImage);
    }

    public void deleteBackgroundImage(String id) {
        backgroundImageRepository.deleteById(id);
    }
}
