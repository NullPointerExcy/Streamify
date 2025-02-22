package org.spdfm.vod_backend.services;

import org.spdfm.vod_backend.models.SiteSettings;
import org.spdfm.vod_backend.repositories.SiteSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SiteSettingsService {

    @Autowired
    private SiteSettingsRepository siteSettingsRepository;

    public List<SiteSettings> getAllSettings() {
        return siteSettingsRepository.findAll();
    }

    public Optional<SiteSettings> getSettings(String id) {
        return siteSettingsRepository.findById(id);
    }

    public SiteSettings saveSettings(SiteSettings settings) {
        return siteSettingsRepository.save(settings);
    }

    public SiteSettings updateSettings(SiteSettings settings) {
        SiteSettings existingSettings = siteSettingsRepository.findById(settings.getId()).orElse(null);
        if (existingSettings == null) {
            return null;
        }
        existingSettings.setSiteName(settings.getSiteName());
        existingSettings.setSiteTitle(settings.getSiteTitle());
        existingSettings.setSiteDescription(settings.getSiteDescription());
        existingSettings.setSiteTheme(settings.getSiteTheme());
        existingSettings.setSiteLogo(settings.getSiteLogo());
        existingSettings.setSiteFavicon(settings.getSiteFavicon());
        existingSettings.setSiteTheme(settings.getSiteTheme());
        existingSettings.setSiteLanguage(settings.getSiteLanguage());

        return siteSettingsRepository.save(existingSettings);
    }

    public void deleteSettings(String id) {
        siteSettingsRepository.deleteById(id);
    }
}
