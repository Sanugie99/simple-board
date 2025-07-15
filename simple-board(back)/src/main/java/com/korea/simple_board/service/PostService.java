package com.korea.simple_board.service;

import com.korea.simple_board.dto.PostDto;
import com.korea.simple_board.entity.Post;
import com.korea.simple_board.entity.Scrap;
import com.korea.simple_board.entity.User;
import com.korea.simple_board.repository.PostRepository;
import com.korea.simple_board.repository.ScrapRepository;
import com.korea.simple_board.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PostService {
    
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ScrapRepository scrapRepository;
    
    public PostDto.PostResponse createPost(String userId, PostDto.CreateRequest request) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .author(user)
                .category(request.getCategory())
                .viewCount(0)
                .build();
        
        Post savedPost = postRepository.save(post);
        
        return convertToPostResponse(savedPost, false);
    }
    
    public PostDto.PostResponse getPost(Long postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        // 조회수 증가
        post.incrementViewCount();
        postRepository.save(post);
        
        // 스크랩 여부 확인
        boolean isScrapped = false;
        if (userId != null) {
            User user = userRepository.findByUserId(userId).orElse(null);
            if (user != null) {
                isScrapped = scrapRepository.existsByPostIdAndUserId(postId, user.getId());
            }
        }
        
        return convertToPostResponse(post, isScrapped);
    }
    
    public Page<PostDto.PostListResponse> getPosts(Post.Category category, Pageable pageable, String userId) {
        Page<Post> posts;
        if (category != null) {
            posts = postRepository.findByCategory(category, pageable);
        } else {
            posts = postRepository.findAll(pageable);
        }
        
        return posts.map(post -> {
            boolean isScrapped = false;
            if (userId != null) {
                User user = userRepository.findByUserId(userId).orElse(null);
                if (user != null) {
                    isScrapped = scrapRepository.existsByPostIdAndUserId(post.getId(), user.getId());
                }
            }
            
            return convertToPostListResponse(post, isScrapped);
        });
    }
    
    public Page<PostDto.PostListResponse> searchPosts(String keyword, Pageable pageable, String userId) {
        Page<Post> posts = postRepository.findByTitleContainingOrContentContaining(keyword, keyword, pageable);
        
        return posts.map(post -> {
            boolean isScrapped = false;
            if (userId != null) {
                User user = userRepository.findByUserId(userId).orElse(null);
                if (user != null) {
                    isScrapped = scrapRepository.existsByPostIdAndUserId(post.getId(), user.getId());
                }
            }
            
            return convertToPostListResponse(post, isScrapped);
        });
    }
    
    public PostDto.PostResponse updatePost(Long postId, String userId, PostDto.UpdateRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        // 작성자 확인
        if (!post.getAuthor().getUserId().equals(userId)) {
            throw new RuntimeException("게시글을 수정할 권한이 없습니다.");
        }
        
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setCategory(request.getCategory());
        
        Post updatedPost = postRepository.save(post);
        
        return convertToPostResponse(updatedPost, false);
    }
    
    public void deletePost(Long postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        // 작성자 확인
        if (!post.getAuthor().getUserId().equals(userId)) {
            throw new RuntimeException("게시글을 삭제할 권한이 없습니다.");
        }
        
        postRepository.delete(post);
    }
    
    public boolean toggleScrap(Long postId, String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        // 이미 스크랩되어 있는지 확인
        if (scrapRepository.existsByPostIdAndUserId(postId, user.getId())) {
            // 스크랩 제거
            scrapRepository.findByPostIdAndUserId(postId, user.getId())
                    .ifPresent(scrapRepository::delete);
            return false;
        } else {
            // 스크랩 추가
            Scrap scrap = Scrap.builder()
                    .post(post)
                    .user(user)
                    .build();
            scrapRepository.save(scrap);
            return true;
        }
    }
    
    public Page<PostDto.PostListResponse> getScrappedPosts(String userId, Pageable pageable) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Page<Scrap> scraps = scrapRepository.findByUser(user, pageable);
        
        return scraps.map(scrap -> convertToPostListResponse(scrap.getPost(), true));
    }
    
    private PostDto.PostResponse convertToPostResponse(Post post, boolean isScrapped) {
        return PostDto.PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .authorName(post.getAuthor() != null ? post.getAuthor().getName() : "알 수 없음")
                .authorUserId(post.getAuthor() != null ? post.getAuthor().getUserId() : "")
                .category(post.getCategory())
                .viewCount(post.getViewCount() != null ? post.getViewCount() : 0)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .fileUrls(post.getFiles() != null ? post.getFiles().stream()
                        .map(file -> file.getFileUrl())
                        .collect(Collectors.toList()) : new ArrayList<>())
                .isScrapped(isScrapped)
                .build();
    }
    
    private PostDto.PostListResponse convertToPostListResponse(Post post, boolean isScrapped) {
        return PostDto.PostListResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .authorName(post.getAuthor() != null ? post.getAuthor().getName() : "알 수 없음")
                .category(post.getCategory())
                .viewCount(post.getViewCount() != null ? post.getViewCount() : 0)
                .createdAt(post.getCreatedAt())
                .isScrapped(isScrapped)
                .build();
    }
} 