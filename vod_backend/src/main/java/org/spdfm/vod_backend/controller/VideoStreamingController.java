package org.spdfm.vod_backend.controller;

import org.spdfm.vod_backend.models.Video;
import org.spdfm.vod_backend.services.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRange;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/videos")
public class VideoStreamingController {

    @Autowired
    private VideoService videoService;

    @GetMapping("/stream/{id}")
    public ResponseEntity<Resource> streamVideo(@PathVariable String id, @RequestHeader HttpHeaders headers) {
        Optional<Video> optionalVideo = videoService.getVideoById(id);

        if (optionalVideo.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Video video = optionalVideo.get();
        Path videoPath = Paths.get(video.getFilePath());

        try {
            Resource videoResource = new UrlResource(videoPath.toUri());
            long videoSize = videoResource.contentLength();
            String contentType = "video/mp4";

            if (headers.getRange().isEmpty()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(videoSize))
                        .body(videoResource);
            } else {
                HttpRange range = headers.getRange().get(0);
                long start = range.getRangeStart(videoSize);
                long end = range.getRangeEnd(videoSize);
                long contentLength = end - start + 1;

                return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(contentLength))
                        .header(HttpHeaders.CONTENT_RANGE, "bytes " + start + "-" + end + "/" + videoSize)
                        .body(videoResource);
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}