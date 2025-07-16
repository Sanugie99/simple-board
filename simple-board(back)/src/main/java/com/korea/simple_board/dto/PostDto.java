package com.korea.simple_board.dto;

import com.korea.simple_board.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class PostDto {
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private String title;
        private String content;
        private Post.Category category;
        private List<String> fileUrls;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String title;
        private String content;
        private Post.Category category;
        private List<String> fileUrls;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostResponse {
        private Long id;
        private String title;
        private String content;
        private String authorName;
        private String authorUserId;
        private Post.Category category;
        private String categoryName;
        private Integer viewCount;
        private Integer scrapCount;
        private Long commentCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<String> fileUrls;
        @lombok.Getter
        private boolean isScrapped;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostListResponse {
        private Long id;
        private String title;
        private String authorName;
        private Post.Category category;
        private String categoryName;
        private Integer viewCount;
        private Integer scrapCount;
        private Long commentCount;
        private LocalDateTime createdAt;
        private boolean isScrapped;
    }
} 