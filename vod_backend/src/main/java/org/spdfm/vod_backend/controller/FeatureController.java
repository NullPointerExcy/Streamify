package org.spdfm.vod_backend.controller;


import org.spdfm.vod_backend.models.Feature;
import org.spdfm.vod_backend.services.FeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/features")
public class FeatureController {

    @Autowired
    private FeatureService featureService;

    @GetMapping
    public List<Feature> getAllFeatures() {
        return featureService.getAllFeatures();
    }

    @GetMapping("/{id}")
    public Feature getFeatureById(@PathVariable String id) {
        return featureService.getFeatureById(id);
    }

    @PutMapping
    public Feature updateFeature(@RequestBody Feature feature) {
        return featureService.updateFeature(feature);
    }

}
