package com.korea.simple_board.repository;

import com.korea.simple_board.entity.Post;
import com.korea.simple_board.entity.Post.Category;
import com.korea.simple_board.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    Page<Post> findByCategory(Category category, Pageable pageable);
    
    Page<Post> findByTitleContainingOrContentContaining(String title, String content, Pageable pageable);
    
    @Modifying
    @Query("UPDATE Post p SET p.viewCount = p.viewCount + 1 WHERE p.id = :postId")
    void incrementViewCount(@Param("postId") Long postId);
    
    Page<Post> findByAuthor(User author, Pageable pageable);
} 