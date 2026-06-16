package VibeWave.controller;

import VibeWave.service.MinioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MinioService minioService;

    @GetMapping("/{*fileName}")
    public ResponseEntity<byte[]> getFile(@PathVariable String fileName){
        return minioService.getFile(fileName);
    }
}
