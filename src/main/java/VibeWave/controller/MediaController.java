package VibeWave.controller;

import VibeWave.service.MinioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "https://innovative-determination-production-d7c1.up.railway.app",
        allowCredentials = "true"
)
public class MediaController {

    private final MinioService minioService;

    @GetMapping("/{*fileName}")
    public ResponseEntity<byte[]> getFile(@PathVariable String fileName){
        return minioService.getFile(fileName);
    }
}
