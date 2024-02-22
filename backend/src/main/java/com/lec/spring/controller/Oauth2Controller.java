package com.lec.spring.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/oauth2")
public class Oauth2Controller {

    // 클라이언트가 토큰 정보를 조회할 수 있는 엔드포인트
    @GetMapping("/login")
    public ResponseEntity<?> getToken(HttpSession session) {
        String accessToken = (String) session.getAttribute("accessToken");

        if (accessToken != null) {
            return ResponseEntity.ok(new TokenResponse(accessToken));
        } else {
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }

    // 토큰 정보를 담는 응답 객체
    public static class TokenResponse {
        private String accessToken;

        public TokenResponse(String accessToken) {
            this.accessToken = accessToken;
        }

    }
}
