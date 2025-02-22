package org.spdfm.vod_backend.controller;

import org.spdfm.vod_backend.models.Game;
import org.spdfm.vod_backend.services.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/v1/games")
public class GameController {

    @Autowired
    private GameService gameService;

    @GetMapping
    public List<Game> getAllGames() {
        List<Game> games = gameService.getAllGames();
        games.forEach(game -> {
            if (game.getCoverImage() != null && !game.getCoverImage().startsWith("http")) {
                game.setCoverImage(game.getCoverImage());
            }
        });
        return games;
    }

    @GetMapping("/{id}")
    public Optional<Game> getGameById(@PathVariable String id) {
        return gameService.getGameById(id);
    }

    @PostMapping("/upload-cover")
    public Map<String, String> uploadCover(@RequestParam("file") MultipartFile file) {
        try {
            byte[] imageBytes = file.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            String dataUrl = "data:" + file.getContentType() + ";base64," + base64Image;

            Map<String, String> response = new HashMap<>();
            response.put("imageData", dataUrl);
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Cover upload failed!", e);
        }
    }


    @PostMapping
    public Game addGame(@RequestBody Game game) {
        return gameService.addGame(game);
    }

    @PutMapping("/{id}")
    public Game updateGame(@PathVariable String id, @RequestBody Game game) {
        return gameService.updateGame(id, game);
    }

    @DeleteMapping("/{id}")
    public void deleteGame(@PathVariable String id) {
        gameService.deleteGame(id);
    }
}
