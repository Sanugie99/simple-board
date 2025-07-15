package com.korea.simple_board.repository;

import com.korea.simple_board.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUserId(String userId);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByUserId(String userId);
    
    boolean existsByEmail(String email);
    
    Optional<User> findByEmailAndName(String email, String name);
    
    Optional<User> findByUserIdAndEmail(String userId, String email);
} 