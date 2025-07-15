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
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    private final UserService userService;
    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserDto.SignupRequest request) {
        try {
            UserDto.LoginResponse response = userService.signup(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto.LoginRequest request) {
        try {
            UserDto.LoginResponse response = userService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/check-id")
    public ResponseEntity<?> checkId(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            // 실제로는 중복 검사 로직이 필요하지만, 여기서는 간단히 처리
            Map<String, Boolean> response = new HashMap<>();
            response.put("available", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            // 실제로는 중복 검사 로직이 필요하지만, 여기서는 간단히 처리
            Map<String, Boolean> response = new HashMap<>();
            response.put("available", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/find-id")
    public ResponseEntity<?> findId(@RequestBody UserDto.FindIdRequest request) {
        try {
            userService.findId(request);
            Map<String, String> response = new HashMap<>();
            response.put("message", "아이디가 이메일로 발송되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/find-password")
    public ResponseEntity<?> findPassword(@RequestBody UserDto.FindPasswordRequest request) {
        try {
            userService.findPassword(request);
            Map<String, String> response = new HashMap<>();
            response.put("message", "임시 비밀번호가 이메일로 발송되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 