package VibeWave.service;

import io.minio.*;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;

    @Value("${minio.bucket}")
    private String bucket;

    public String uploadFileFromPost(MultipartFile file, Long postId){
        try{
            String fileName = "post/" + "File-to-post-number-" + postId + "/" + UUID.randomUUID() + file.getOriginalFilename();
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(fileName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            return fileName;
        }
        catch (Exception e){
            throw new RuntimeException("Ошибка загрузки файла");
        }
    }

    public String uploadFileFromUserProfile(MultipartFile file, Long userId){
        try{
            String fileName = "avatars/" + "Avatar-to-user-number-" + userId + "/" + file.getOriginalFilename();
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(fileName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            return fileName;
        }

        catch (Exception e){
            throw new RuntimeException("Ошибка загрузки файла" + e.getMessage());
        }
    }


    public String getFileURL(String fileName){
        try{
            return "/api/media/" + fileName;
        } catch (Exception e){
            throw new RuntimeException("Ошибка получения ссылки");
        }

    }

    public ResponseEntity<byte[]> getFile(String fileName){
        try {
            InputStream stream = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucket)
                            .object(fileName)
                            .build()
            );

            byte[] bytes = stream.readAllBytes();

            return ResponseEntity.ok()
                    .header("Content-Type", "image/jpeg") // можно улучшить позже
                    .body(bytes);

        } catch (Exception e) {
            throw new RuntimeException("Ошибка получения файла");
        }
    }

    public void deleteFileFromMinio(String fileName){
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucket)
                            .object(fileName)
                            .build());
        } catch (Exception e){
            throw new RuntimeException("Ошибка удаления");
        }
    }

}
