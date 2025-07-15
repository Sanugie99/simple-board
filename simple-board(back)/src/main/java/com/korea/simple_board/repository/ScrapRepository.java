package com.korea.simple_board.repository;

import com.korea.simple_board.entity.Scrap;
import com.korea.simple_board.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ScrapRepository extends JpaRepository<Scrap, Long> {
    
    Page<Scrap> findByUser(User user, Pageable pageable);
    
    Optional<Scrap> findByPostIdAndUserId(Long postId, Long userId);
    
    boolean existsByPostIdAndUserId(Long postId, Long userId);
} 