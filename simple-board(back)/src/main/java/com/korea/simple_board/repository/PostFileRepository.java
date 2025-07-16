package com.korea.simple_board.repository;

import com.korea.simple_board.entity.PostFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostFileRepository extends JpaRepository<PostFile, Long> {
    
    List<PostFile> findByPostId(Long postId);
    
    void deleteByPostId(Long postId);
} 