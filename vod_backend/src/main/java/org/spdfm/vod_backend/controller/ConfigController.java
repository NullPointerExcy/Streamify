package org.spdfm.vod_backend.controller;


import org.spdfm.vod_backend.models.Config;
import org.spdfm.vod_backend.services.ConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/configs")
public class ConfigController {

    @Autowired
    private ConfigService configService;


    @GetMapping
    public List<Config> getAllConfigs() {
        return configService.getAllConfigs();
    }

    @PostMapping
    public void addConfig(@RequestBody Config config) {
        configService.addConfig(config);
    }

    @GetMapping("/{key}")
    public Config getConfigByKey(@PathVariable String key) {
        return configService.getConfigByKey(key);
    }

    @PutMapping
    public Config updateConfig(@RequestBody Config config) {
        return configService.updateConfig(config);
    }

}
