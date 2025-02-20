package org.spdfm.vod_backend.services;

import org.spdfm.vod_backend.models.Genre;
import org.spdfm.vod_backend.repositories.GenreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GenreService {

    @Autowired
    private GenreRepository genreRepository;

    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    public Optional<Genre> getGenreById(String id) {
        return genreRepository.findById(id);
    }

    public Genre addGenre(Genre genre) {
        return genreRepository.save(genre);
    }
}
