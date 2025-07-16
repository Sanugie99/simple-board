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
    
    @PostMapping("/check-id")
    public ResponseEntity<?> checkUserId(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            if (userId == null || userId.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "아이디를 입력해주세요.");
                return ResponseEntity.badRequest().body(error);
            }
            
            boolean isAvailable = userService.checkUserIdAvailability(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", isAvailable);
            response.put("message", isAvailable ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("아이디 중복 확인 중 오류 발생: ", e);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "아이디 확인 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "이메일을 입력해주세요.");
                return ResponseEntity.badRequest().body(error);
            }
            
            boolean isAvailable = userService.checkEmailAvailability(email);
            Map<String, Object> response = new HashMap<>();
            response.put("success", isAvailable);
            response.put("message", isAvailable ? "사용 가능한 이메일입니다." : "이미 사용 중인 이메일입니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("이메일 중복 확인 중 오류 발생: ", e);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "이메일 확인 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserDto.SignupRequest request) {
        try {
            UserDto.UserInfoResponse userInfo = userService.signup(request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "회원가입이 완료되었습니다.");
            response.put("user", userInfo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("회원가입 중 오류 발생: ", e);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/check-password")
    public ResponseEntity<?> checkPassword(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            String password = request.get("password");
            
            if (userId == null || userId.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "아이디를 입력해주세요.");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (password == null || password.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "비밀번호를 입력해주세요.");
                return ResponseEntity.badRequest().body(error);
            }
            
            boolean isValid = userService.checkPassword(userId, password);
            Map<String, Object> response = new HashMap<>();
            response.put("success", isValid);
            response.put("message", isValid ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("비밀번호 확인 중 오류 발생: ", e);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "비밀번호 확인 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto.LoginRequest request) {
        try {
            UserDto.LoginResponse loginResponse = userService.login(request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "로그인되었습니다.");
            response.put("token", loginResponse.getToken());
            response.put("userId", loginResponse.getUserId());
            response.put("name", loginResponse.getName());
            response.put("email", loginResponse.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("로그인 중 오류 발생: ", e);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 