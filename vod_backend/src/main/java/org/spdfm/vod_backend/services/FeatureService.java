package org.spdfm.vod_backend.services;


import org.spdfm.vod_backend.models.Feature;
import org.spdfm.vod_backend.repositories.FeatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeatureService {

    @Autowired
    private FeatureRepository featureRepository;

    public List<Feature> getAllFeatures() {
        return featureRepository.findAll();
    }

    public Feature getFeatureById(String id) {
        return featureRepository.findById(id).orElse(null);
    }

    public Feature updateFeature(Feature feature) {
        return featureRepository.save(feature);
    }

}
