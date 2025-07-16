package com.korea.simple_board.service;

import com.korea.simple_board.entity.Comment;
import com.korea.simple_board.entity.Post;
import com.korea.simple_board.entity.User;
import com.korea.simple_board.repository.CommentRepository;
import com.korea.simple_board.repository.PostRepository;
import com.korea.simple_board.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 댓글 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {
    
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    
    /**
     * 댓글 작성
     */
    public Map<String, Object> createComment(Long postId, String content, String userId) {
        try {
            // 게시글 존재 확인
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
            
            // 사용자 존재 확인
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            
            // 댓글 내용 검증
            if (content == null || content.trim().isEmpty()) {
                throw new RuntimeException("댓글 내용을 입력해주세요.");
            }
            
            if (content.trim().length() > 1000) {
                throw new RuntimeException("댓글은 1000자를 초과할 수 없습니다.");
            }
            
            // 댓글 생성
            Comment comment = Comment.builder()
                    .content(content.trim())
                    .post(post)
                    .author(user)
                    .build();
            
            Comment savedComment = commentRepository.save(comment);
            
            return Map.of(
                "success", true,
                "message", "댓글이 작성되었습니다.",
                "comment", Map.of(
                    "id", savedComment.getId(),
                    "content", savedComment.getContent(),
                    "authorUserId", savedComment.getAuthor().getUserId(),
                    "authorName", savedComment.getAuthor().getName(),
                    "createdAt", savedComment.getCreatedAt()
                )
            );
            
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "message", e.getMessage()
            );
        }
    }
    
    // 게시글의 댓글 목록 조회
    public Map<String, Object> getCommentsByPostId(Long postId) {
        try {
            // 게시글 존재 확인
            if (!postRepository.existsById(postId)) {
                throw new RuntimeException("게시글을 찾을 수 없습니다.");
            }
            
            List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
            
            List<Map<String, Object>> commentList = comments.stream()
                    .map(comment -> {
                        Map<String, Object> commentMap = Map.of(
                            "id", comment.getId(),
                            "content", comment.getContent(),
                            "authorUserId", comment.getAuthor().getUserId(),
                            "authorName", comment.getAuthor().getName(),
                            "createdAt", comment.getCreatedAt(),
                            "updatedAt", comment.getUpdatedAt()
                        );
                        return commentMap;
                    })
                    .collect(Collectors.toList());
            
            return Map.of(
                "success", true,
                "comments", commentList,
                "totalCount", commentList.size()
            );
            
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "message", e.getMessage()
            );
        }
    }
    
    // 댓글 수정
    public Map<String, Object> updateComment(Long commentId, String content, String userId) {
        try {
            Comment comment = commentRepository.findById(commentId)
                    .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));
            
            // 작성자 확인
            if (!comment.getAuthor().getUserId().equals(userId)) {
                throw new RuntimeException("댓글을 수정할 권한이 없습니다.");
            }
            
            // 댓글 내용 검증
            if (content == null || content.trim().isEmpty()) {
                throw new RuntimeException("댓글 내용을 입력해주세요.");
            }
            
            if (content.trim().length() > 1000) {
                throw new RuntimeException("댓글은 1000자를 초과할 수 없습니다.");
            }
            
            // 댓글 수정
            comment.setContent(content.trim());
            Comment updatedComment = commentRepository.save(comment);
            
            return Map.of(
                "success", true,
                "message", "댓글이 수정되었습니다.",
                "comment", Map.of(
                    "id", updatedComment.getId(),
                    "content", updatedComment.getContent(),
                    "authorUserId", updatedComment.getAuthor().getUserId(),
                    "authorName", updatedComment.getAuthor().getName(),
                    "createdAt", updatedComment.getCreatedAt(),
                    "updatedAt", updatedComment.getUpdatedAt()
                )
            );
            
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "message", e.getMessage()
            );
        }
    }
    
    // 댓글 삭제
    public Map<String, Object> deleteComment(Long commentId, String userId) {
        try {
            Comment comment = commentRepository.findById(commentId)
                    .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));
            
            // 작성자 확인
            if (!comment.getAuthor().getUserId().equals(userId)) {
                throw new RuntimeException("댓글을 삭제할 권한이 없습니다.");
            }
            
            commentRepository.delete(comment);
            
            return Map.of(
                "success", true,
                "message", "댓글이 삭제되었습니다."
            );
            
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "message", e.getMessage()
            );
        }
    }
    
    // 사용자가 작성한 댓글 목록 조회
    public Map<String, Object> getCommentsByUserId(String userId) {
        try {
            List<Comment> comments = commentRepository.findByAuthorUserIdOrderByCreatedAtDesc(userId);
            
            List<Map<String, Object>> commentList = comments.stream()
                    .map(comment -> {
                        Map<String, Object> commentMap = Map.of(
                            "id", comment.getId(),
                            "content", comment.getContent(),
                            "postId", comment.getPost().getId(),
                            "postTitle", comment.getPost().getTitle(),
                            "createdAt", comment.getCreatedAt()
                        );
                        return commentMap;
                    })
                    .collect(Collectors.toList());
            
            return Map.of(
                "success", true,
                "comments", commentList,
                "totalCount", commentList.size()
            );
            
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "message", e.getMessage()
            );
        }
    }
} 