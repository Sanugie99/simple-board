package com.korea.simple_board.repository;

import com.korea.simple_board.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    // 게시글 ID로 댓글 목록 조회 (작성일 오름차순)
    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);
    
    // 사용자 ID로 댓글 목록 조회
    List<Comment> findByAuthorUserIdOrderByCreatedAtDesc(String userId);
    
    // 게시글의 댓글 수 조회
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId")
    long countByPostId(@Param("postId") Long postId);
    
    // 사용자가 작성한 댓글 수 조회
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.author.userId = :userId")
    long countByAuthorUserId(@Param("userId") String userId);
} 