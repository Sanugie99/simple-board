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
        // 데이터베이스가 비어있을 때만 테스트 데이터 생성
        if (userRepository.count() == 0) {
            log.info("데이터베이스가 비어있어 테스트 데이터를 생성합니다.");
            
            // testuser 생성
            User testUser = User.builder()
                    .userId("testuser")
                    .password(passwordEncoder.encode("password"))
                    .email("test@example.com")
                    .name("테스트 사용자")
                    .role(User.Role.USER)
                    .build();
            
            userRepository.save(testUser);
            log.info("테스트 사용자가 생성되었습니다: {}", testUser.getUserId());
            
            // test 사용자 생성 (프론트엔드에서 사용)
            User testUser2 = User.builder()
                    .userId("test")
                    .password(passwordEncoder.encode("password"))
                    .email("test2@example.com")
                    .name("테스트 사용자2")
                    .role(User.Role.USER)
                    .build();
            
            userRepository.save(testUser2);
            log.info("테스트 사용자2가 생성되었습니다: {}", testUser2.getUserId());
            
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
            
            // test 사용자의 게시글도 생성
            Post testPost2 = Post.builder()
                    .title("test 사용자의 게시글")
                    .content("test 사용자가 작성한 게시글입니다.")
                    .author(testUser2)
                    .category(Post.Category.GENERAL)
                    .viewCount(0)
                    .build();
            
            postRepository.save(testPost2);
            log.info("test 사용자의 게시글이 생성되었습니다: {}", testPost2.getTitle());
        } else {
            log.info("데이터베이스에 기존 데이터가 있어 테스트 데이터 생성을 건너뜁니다.");
        }
    }
} 