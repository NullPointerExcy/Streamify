package org.spdfm.vod_backend.services;


import org.spdfm.vod_backend.models.Config;
import org.spdfm.vod_backend.repositories.ConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConfigService {

    @Autowired
    private ConfigRepository configRepository;


    public List<Config> getAllConfigs() {
        return configRepository.findAll();
    }

    public Config addConfig(Config config) {
        return configRepository.save(config);
    }

    public Config getConfigByKey(String key) {
        return configRepository.findByKey(key);
    }

    public Config updateConfig(Config config) {
        Config existingConfig = configRepository.findByKey(config.getKey());
        existingConfig.setValue(config.getValue());
        return configRepository.save(existingConfig);
    }

}
