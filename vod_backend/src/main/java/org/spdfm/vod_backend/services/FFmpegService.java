package org.spdfm.vod_backend.services;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


@Service
public class FFmpegService {

    @Async
    public void encodeToHLS(String gameId, String videoId, String outputDirectory, String videoDir) {
        try {
            // Construct the path to the video file
            String vidDir = String.format(videoDir + "%s/%s", gameId, videoId);

            // Find the video file inside the directory
            String videoFilePath = Files.list(Paths.get(vidDir))
                    .filter(path -> path.toString().endsWith(".mp4") ||
                            path.toString().endsWith(".mkv") ||
                            path.toString().endsWith(".webm"))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("No video file found in directory: " + vidDir))
                    .toString();

            // Normalize paths for Windows compatibility (Also need to do this for Unix-like systems)
            videoFilePath = videoFilePath.replace("\\", "/");
            outputDirectory = outputDirectory.replace("\\", "/");
            System.out.println("Encoding video file: " + videoFilePath);

            new java.io.File(outputDirectory).mkdirs();
            System.out.println("Encoding to HLS: " + videoFilePath + " to " + outputDirectory);

            // FFmpeg Command for HLS encoding
            String command = String.format(
                    "ffmpeg -y -i \"%s\" " +
                            "-map v:0 -c:v libx264 -b:v 20000k -maxrate 20000k -bufsize 40000k -s 3840x2160 -f hls -hls_time 6 -hls_playlist_type vod -hls_segment_filename \"%s/2160p_%%03d.ts\" \"%s/2160p.m3u8\" " +
                            "-map v:0 -c:v libx264 -b:v 12000k -maxrate 12000k -bufsize 24000k -s 2560x1440 -f hls -hls_time 6 -hls_playlist_type vod -hls_segment_filename \"%s/1440p_%%03d.ts\" \"%s/1440p.m3u8\" " +
                            "-map v:0 -c:v libx264 -b:v 6000k -maxrate 6000k -bufsize 12000k -s 1920x1080 -f hls -hls_time 6 -hls_playlist_type vod -hls_segment_filename \"%s/1080p_%%03d.ts\" \"%s/1080p.m3u8\" " +
                            "-map v:0 -c:v libx264 -b:v 3000k -maxrate 3000k -bufsize 6000k -s 1280x720 -f hls -hls_time 6 -hls_playlist_type vod -hls_segment_filename \"%s/720p_%%03d.ts\" \"%s/720p.m3u8\" " +
                            "-map v:0 -c:v libx264 -b:v 1500k -maxrate 1500k -bufsize 3000k -s 854x480 -f hls -hls_time 6 -hls_playlist_type vod -hls_segment_filename \"%s/480p_%%03d.ts\" \"%s/480p.m3u8\"",
                    videoFilePath, outputDirectory, outputDirectory,
                    outputDirectory, outputDirectory,
                    outputDirectory, outputDirectory,
                    outputDirectory, outputDirectory,
                    outputDirectory, outputDirectory
            );

            ProcessBuilder builder = new ProcessBuilder("cmd.exe", "/c", command);
            builder.redirectErrorStream(true);
            builder.directory(new java.io.File(outputDirectory));
            Process process = builder.start();

            // For debugging purposes
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println("FFmpeg: " + line);
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("FFmpeg process failed with exit code " + exitCode);
            }

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            throw new RuntimeException("FFmpeg HLS encoding failed", e);
        }
    }
}
