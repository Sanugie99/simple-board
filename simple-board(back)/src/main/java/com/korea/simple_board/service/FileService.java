package com.korea.simple_board.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {
    
    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;
    
    @Value("${cloud.aws.region.static}")
    private String region;
    
    public String uploadFile(MultipartFile file) {
        try {
            // 파일명 중복 방지를 위한 UUID 생성
            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String storedFileName = UUID.randomUUID().toString() + fileExtension;
            
            // AWS S3 업로드 로직 (실제 구현 시 AWS SDK 사용)
            // 여기서는 임시로 로컬 경로를 반환
            String fileUrl = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + storedFileName;
            
            log.info("File uploaded: {} -> {}", originalFileName, fileUrl);
            
            return fileUrl;
        } catch (Exception e) {
            log.error("File upload failed: {}", e.getMessage());
            throw new RuntimeException("파일 업로드에 실패했습니다.");
        }
    }
    
    public void deleteFile(String fileUrl) {
        try {
            // AWS S3 삭제 로직 (실제 구현 시 AWS SDK 사용)
            log.info("File deleted: {}", fileUrl);
        } catch (Exception e) {
            log.error("File deletion failed: {}", e.getMessage());
            throw new RuntimeException("파일 삭제에 실패했습니다.");
        }
    }
} 