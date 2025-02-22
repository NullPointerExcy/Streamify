package org.spdfm.vod_backend.controller;

import org.spdfm.vod_backend.models.SiteSettings;
import org.spdfm.vod_backend.services.SiteSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/settings")
public class SiteSettingsController {

    @Autowired
    private SiteSettingsService siteSettingsService;

    @GetMapping
    public List<SiteSettings> getAllSettings() {
        return siteSettingsService.getAllSettings();
    }

    @GetMapping("/{id}")
    public Optional<SiteSettings> getSettings(@PathVariable String id) {
        return siteSettingsService.getSettings(id);
    }

    @PostMapping
    public SiteSettings saveSettings(@RequestBody SiteSettings settings) {
        return siteSettingsService.saveSettings(settings);
    }

    @PutMapping
    public SiteSettings updateSettings(@RequestBody SiteSettings settings) {
        return siteSettingsService.updateSettings(settings);
    }

    @DeleteMapping("/{id}")
    public void deleteSettings(@PathVariable String id) {
        siteSettingsService.deleteSettings(id);
    }
}
