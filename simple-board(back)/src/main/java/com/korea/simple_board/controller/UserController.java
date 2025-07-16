package com.korea.simple_board.controller;

import com.korea.simple_board.dto.UserDto;
import com.korea.simple_board.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    private final UserService userService;
    
    @PostMapping("/info")
    public ResponseEntity<?> getUserInfo(@RequestParam String userId) {
        try {
            log.info("사용자 정보 조회 요청 - userId: {}", userId);
            UserDto.UserInfoResponse userInfo = userService.getUserInfo(userId);
            log.info("사용자 정보 조회 성공 - userId: {}", userId);
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            log.error("사용자 정보 조회 중 오류 발생 - userId: {}, error: {}", userId, e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/update")
    public ResponseEntity<?> updateUserInfo(
            @RequestParam String userId,
            @RequestBody UserDto.UpdateRequest request) {
        try {
            UserDto.UserInfoResponse userInfo = userService.updateUserInfo(userId, request);
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(@RequestParam String userId) {
        try {
            userService.deleteUser(userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "회원탈퇴가 완료되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/find-id")
    public ResponseEntity<?> findUserId(@RequestParam String email) {
        try {
            log.info("아이디 찾기 요청 - email: {}", email);
            String userId = userService.findUserIdByEmail(email);
            Map<String, String> response = new HashMap<>();
            response.put("userId", userId);
            response.put("message", "아이디를 찾았습니다.");
            log.info("아이디 찾기 성공 - email: {}, userId: {}", email, userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("아이디 찾기 중 오류 발생 - email: {}, error: {}", email, e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/check-password")
    public ResponseEntity<?> checkPassword(
            @RequestParam String userId,
            @RequestParam String password) {
        try {
            log.info("비밀번호 확인 요청 - userId: {}", userId);
            boolean isMatch = userService.checkPassword(userId, password);
            Map<String, Object> response = new HashMap<>();
            response.put("isMatch", isMatch);
            response.put("message", isMatch ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다.");
            log.info("비밀번호 확인 완료 - userId: {}, isMatch: {}", userId, isMatch);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("비밀번호 확인 중 오류 발생 - userId: {}, error: {}", userId, e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam String userId,
            @RequestParam String email,
            @RequestParam String newPassword) {
        try {
            log.info("비밀번호 재설정 요청 - userId: {}, email: {}", userId, email);
            userService.resetPassword(userId, email, newPassword);
            Map<String, String> response = new HashMap<>();
            response.put("message", "비밀번호가 성공적으로 재설정되었습니다.");
            log.info("비밀번호 재설정 성공 - userId: {}", userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("비밀번호 재설정 중 오류 발생 - userId: {}, email: {}, error: {}", userId, email, e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 