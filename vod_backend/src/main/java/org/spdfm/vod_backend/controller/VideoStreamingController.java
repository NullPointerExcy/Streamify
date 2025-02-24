package org.spdfm.vod_backend.controller;

import org.spdfm.vod_backend.models.Video;
import org.spdfm.vod_backend.services.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRange;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/videos/stream")
public class VideoStreamingController {

    @Autowired
    private VideoService videoService;

    // TODO: Add .m3u8, .ts support for HLS streaming
    @GetMapping("/{id}")
    public ResponseEntity<Resource> streamVideo(@PathVariable String id, @RequestHeader HttpHeaders headers) {
        Optional<Video> optionalVideo = videoService.getVideoById(id);
        if (optionalVideo.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Video video = optionalVideo.get();
        Path videoPath = Paths.get(video.getFilePath());

        try {
            Resource videoResource = new UrlResource(videoPath.toUri());
            long contentLength = videoResource.contentLength();

            String contentType = java.nio.file.Files.probeContentType(videoPath);
            if (contentType == null) {
                // fallback if unknown
                contentType = "application/octet-stream";
            }

            List<HttpRange> httpRanges = headers.getRange();

            if (httpRanges.isEmpty()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(contentLength))
                        .body(videoResource);
            } else {
                HttpRange range = httpRanges.get(0);
                long start = range.getRangeStart(contentLength);
                long end = range.getRangeEnd(contentLength);
                long rangeLength = end - start + 1;

                InputStream inputStream = new FileInputStream(videoResource.getFile());
                inputStream.skip(start);
                InputStreamResource partialStream = new InputStreamResource(inputStream);

                return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(rangeLength))
                        .header(HttpHeaders.CONTENT_RANGE, "bytes " + start + "-" + end + "/" + contentLength)
                        .body(partialStream);
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}