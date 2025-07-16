package com.korea.simple_board.controller;

import com.korea.simple_board.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {
    
    private final CommentService commentService;
    
    // 댓글 작성
    @PostMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> createComment(
            @PathVariable Long postId,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String token) {
        
        String userId = extractUserIdFromToken(token);
        String content = request.get("content");
        
        Map<String, Object> result = commentService.createComment(postId, content, userId);
        
        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }
    
    // 게시글의 댓글 목록 조회
    @GetMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> getCommentsByPostId(@PathVariable Long postId) {
        Map<String, Object> result = commentService.getCommentsByPostId(postId);
        
        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }
    
    // 댓글 수정
    @PutMapping("/{commentId}")
    public ResponseEntity<Map<String, Object>> updateComment(
            @PathVariable Long commentId,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String token) {
        
        String userId = extractUserIdFromToken(token);
        String content = request.get("content");
        
        Map<String, Object> result = commentService.updateComment(commentId, content, userId);
        
        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }
    
    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Map<String, Object>> deleteComment(
            @PathVariable Long commentId,
            @RequestHeader("Authorization") String token) {
        
        String userId = extractUserIdFromToken(token);
        
        Map<String, Object> result = commentService.deleteComment(commentId, userId);
        
        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }
    
    // 사용자가 작성한 댓글 목록 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getCommentsByUserId(@PathVariable String userId) {
        Map<String, Object> result = commentService.getCommentsByUserId(userId);
        
        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }
    
    // JWT 토큰에서 사용자 ID 추출 (간단한 구현)
    private String extractUserIdFromToken(String token) {
        // 실제 구현에서는 JWT 토큰을 파싱하여 사용자 ID를 추출해야 합니다.
        // 여기서는 간단히 "Bearer " 접두사를 제거하고 사용자 ID로 사용합니다.
        if (token != null && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        throw new RuntimeException("유효하지 않은 토큰입니다.");
    }
} 