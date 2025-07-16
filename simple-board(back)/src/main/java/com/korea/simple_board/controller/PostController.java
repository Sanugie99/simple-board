package com.korea.simple_board.controller;

import com.korea.simple_board.dto.PostDto;
import com.korea.simple_board.entity.Post;
import com.korea.simple_board.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {
    
    private final PostService postService;
    
    @GetMapping
    public ResponseEntity<?> getPosts(
            @RequestParam(required = false) Post.Category category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String userId) {
        try {
            log.info("게시글 목록 조회 요청 - category: {}, page: {}, size: {}, userId: {}", category, page, size, userId);
            Pageable pageable = PageRequest.of(page, size);
            Page<PostDto.PostListResponse> posts = postService.getPosts(category, pageable, userId);
            log.info("게시글 목록 조회 성공 - 총 {}개 게시글", posts.getTotalElements());
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            log.error("게시글 목록 조회 중 오류 발생: ", e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "게시글을 불러오는 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String userId) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<PostDto.PostListResponse> posts = postService.searchPosts(keyword, pageable, userId);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/{postId}")
    public ResponseEntity<?> getPost(
            @PathVariable Long postId,
            @RequestParam(required = false) String userId) {
        try {
            PostDto.PostResponse post = postService.getPost(postId, userId);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestBody PostDto.CreateRequest request,
            @RequestParam String userId) {
        try {
            PostDto.PostResponse post = postService.createPost(userId, request);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(
            @PathVariable Long postId,
            @RequestBody PostDto.UpdateRequest request,
            @RequestParam String userId) {
        try {
            PostDto.PostResponse post = postService.updatePost(postId, userId, request);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long postId,
            @RequestParam String userId) {
        try {
            postService.deletePost(postId, userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "게시글이 삭제되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/{postId}/scrap")
    public ResponseEntity<?> toggleScrap(
            @PathVariable Long postId,
            @RequestParam String userId) {
        try {
            Map<String, Object> result = postService.toggleScrap(postId, userId);
            boolean isScrapped = (Boolean) result.get("isScrapped");
            result.put("message", isScrapped ? "스크랩되었습니다." : "스크랩이 해제되었습니다.");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/scrapped")
    public ResponseEntity<?> getScrappedPosts(
            @RequestParam String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<PostDto.PostListResponse> posts = postService.getScrappedPosts(userId, pageable);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/scrapped/ids")
    public ResponseEntity<?> getScrappedPostIds(@RequestParam String userId) {
        try {
            List<Long> scrapedPostIds = postService.getScrappedPostIds(userId);
            return ResponseEntity.ok(scrapedPostIds);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserPosts(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            log.info("사용자 글 목록 조회 요청 - userId: {}, page: {}, size: {}", userId, page, size);
            Pageable pageable = PageRequest.of(page, size);
            Page<PostDto.PostListResponse> posts = postService.getUserPosts(userId, pageable);
            log.info("사용자 글 목록 조회 성공 - 총 {}개 게시글", posts.getTotalElements());
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            log.error("사용자 글 목록 조회 중 오류 발생: ", e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "사용자 글 목록을 불러오는 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(error);
        }
    }
} 