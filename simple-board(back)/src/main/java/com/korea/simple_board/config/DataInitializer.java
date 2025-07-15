package com.korea.simple_board.config;

import com.korea.simple_board.entity.Post;
import com.korea.simple_board.entity.User;
import com.korea.simple_board.repository.PostRepository;
import com.korea.simple_board.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // 테스트 사용자 생성
        if (userRepository.count() == 0) {
            User testUser = User.builder()
                    .userId("testuser")
                    .password(passwordEncoder.encode("password"))
                    .email("test@example.com")
                    .name("테스트 사용자")
                    .role(User.Role.USER)
                    .build();
            
            userRepository.save(testUser);
            log.info("테스트 사용자가 생성되었습니다: {}", testUser.getUserId());
            
            // 테스트 게시글 생성
            Post testPost = Post.builder()
                    .title("테스트 게시글")
                    .content("이것은 테스트 게시글입니다.")
                    .author(testUser)
                    .category(Post.Category.GENERAL)
                    .viewCount(0)
                    .build();
            
            postRepository.save(testPost);
            log.info("테스트 게시글이 생성되었습니다: {}", testPost.getTitle());
        }
    }
} 