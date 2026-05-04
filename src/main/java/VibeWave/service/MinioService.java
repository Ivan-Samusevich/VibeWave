package VibeWave.service;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;

    @Value("${minio.bucket}")
    private String bucket;

    public String uploadFileFromPost(MultipartFile file, Long postId){
        try{
            String fileName = "post/" + "Файлы к посту по номеру: " + postId + "/" + UUID.randomUUID() + file.getOriginalFilename();
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


    public String getFileURL(String fileName){

        try{
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .bucket(bucket)
                            .object(fileName)
                            .method(Method.GET)
                            .expiry(60*60)// 1 час
                            .build()
            );
        } catch (Exception e){
            throw new RuntimeException("Ошибка получения ссылки");
        }

    }

}
