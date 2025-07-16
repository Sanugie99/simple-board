package com.korea.simple_board.service;

import com.korea.simple_board.dto.PostDto;
import com.korea.simple_board.entity.Post;
import com.korea.simple_board.entity.PostFile;
import com.korea.simple_board.entity.Scrap;
import com.korea.simple_board.entity.User;
import com.korea.simple_board.repository.CommentRepository;
import com.korea.simple_board.repository.PostFileRepository;
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
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

/**
 * 게시글 서비스
 * 게시글 작성, 조회, 수정, 삭제와 스크랩 기능을 담당
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PostService {
    
    private final PostRepository postRepository;
    private final PostFileRepository postFileRepository;
    private final UserRepository userRepository;
    private final ScrapRepository scrapRepository;
    private final CommentRepository commentRepository;
    
    /**
     * 게시글 작성
     */
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
        
        // 첨부파일 처리
        if (request.getFileUrls() != null && !request.getFileUrls().isEmpty()) {
            for (String fileUrl : request.getFileUrls()) {
                if (fileUrl != null && !fileUrl.trim().isEmpty()) {
                    String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
                    
                    PostFile postFile = PostFile.builder()
                            .originalFileName(fileName)
                            .storedFileName(fileName)
                            .fileUrl(fileUrl)
                            .fileSize(0L)
                            .contentType("application/octet-stream")
                            .postId(savedPost.getId())
                            .build();
                    
                    postFileRepository.save(postFile);
                }
            }
        }
        
        return convertToPostResponse(savedPost, false);
    }
    
    /**
     * 게시글 조회
     */
    public PostDto.PostResponse getPost(Long postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        post.incrementViewCount();
        postRepository.save(post);
        
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
        
        // 기존 파일 목록 삭제
        postFileRepository.deleteByPostId(postId);
        
        // 새로운 파일 정보 저장
        if (request.getFileUrls() != null && !request.getFileUrls().isEmpty()) {
            for (String fileUrl : request.getFileUrls()) {
                if (fileUrl != null && !fileUrl.trim().isEmpty()) {
                    // 파일명 추출
                    String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
                    
                    PostFile postFile = PostFile.builder()
                            .originalFileName(fileName)
                            .storedFileName(fileName)
                            .fileUrl(fileUrl)
                            .fileSize(0L) // 실제 파일 크기는 추후 구현
                            .contentType("application/octet-stream") // 기본 타입
                            .postId(post.getId())
                            .build();
                    
                    postFileRepository.save(postFile);
                }
            }
        }
        
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
    
    /**
     * 스크랩 토글
     */
    public Map<String, Object> toggleScrap(Long postId, String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        boolean isScrapped;
        if (scrapRepository.existsByPostIdAndUserId(postId, user.getId())) {
            scrapRepository.findByPostIdAndUserId(postId, user.getId())
                    .ifPresent(scrapRepository::delete);
            isScrapped = false;
        } else {
            Scrap scrap = Scrap.builder()
                    .post(post)
                    .user(user)
                    .build();
            scrapRepository.save(scrap);
            isScrapped = true;
        }
        
        int scrapCount = scrapRepository.countByPostId(postId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("isScrapped", isScrapped);
        result.put("scrapCount", scrapCount);
        
        return result;
    }
    
    public Page<PostDto.PostListResponse> getScrappedPosts(String userId, Pageable pageable) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Page<Scrap> scraps = scrapRepository.findByUser(user, pageable);
        
        return scraps.map(scrap -> convertToPostListResponse(scrap.getPost(), true));
    }
    
    public List<Long> getScrappedPostIds(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        return scrapRepository.findByUser(user, Pageable.unpaged())
                .getContent()
                .stream()
                .map(scrap -> scrap.getPost().getId())
                .collect(Collectors.toList());
    }
    
    public Page<PostDto.PostListResponse> getUserPosts(String userId, Pageable pageable) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Page<Post> posts = postRepository.findByAuthor(user, pageable);
        
        return posts.map(post -> convertToPostListResponse(post, false));
    }
    
    private PostDto.PostResponse convertToPostResponse(Post post, boolean isScrapped) {
        long commentCount = commentRepository.countByPostId(post.getId());
        
        return PostDto.PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .authorName(post.getAuthor() != null ? post.getAuthor().getName() : "알 수 없음")
                .authorUserId(post.getAuthor() != null ? post.getAuthor().getUserId() : "")
                .category(post.getCategory())
                .categoryName(post.getCategory() != null ? post.getCategory().getDisplayName() : "")
                .viewCount(post.getViewCount() != null ? post.getViewCount() : 0)
                .scrapCount(post.getScraps() != null ? post.getScraps().size() : 0)
                .commentCount(commentCount)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .fileUrls(postFileRepository.findByPostId(post.getId()).stream()
                        .map(file -> file.getFileUrl())
                        .collect(Collectors.toList()))
                .isScrapped(isScrapped)
                .build();
    }
    
    private PostDto.PostListResponse convertToPostListResponse(Post post, boolean isScrapped) {
        // 댓글 수 조회
        long commentCount = commentRepository.countByPostId(post.getId());
        
        return PostDto.PostListResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .authorName(post.getAuthor() != null ? post.getAuthor().getName() : "알 수 없음")
                .category(post.getCategory())
                .categoryName(post.getCategory() != null ? post.getCategory().getDisplayName() : "")
                .viewCount(post.getViewCount() != null ? post.getViewCount() : 0)
                .scrapCount(post.getScraps() != null ? post.getScraps().size() : 0)
                .commentCount(commentCount)
                .createdAt(post.getCreatedAt())
                .isScrapped(isScrapped)
                .build();
    }
} 