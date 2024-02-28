package com.lec.spring.OAuth2;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lec.spring.domain.Auth;
import com.lec.spring.domain.RefreshToken;
import com.lec.spring.dto.TokenDTO;
import com.lec.spring.jwt.TokenProvider;
import com.lec.spring.repository.RefreshTokenRepository;
import com.lec.spring.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final TokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        log.info("OAuth2 로그인 성공: {}", authentication.getName());

        // TokenProvider를 사용하여 토큰 생성
        TokenDTO tokenDTO = tokenProvider.createTokenDto(authentication);

        // 클라이언트에 토큰 정보 전송 (예시로는 HTTP 헤더에 토큰을 추가)
        response.addHeader("Authorization", "Bearer " + tokenDTO.getAccessToken());
        response.addHeader("Refresh-Token", tokenDTO.getRefreshToken());
        response.addHeader("Access-Token-Expire-Time", String.valueOf(tokenDTO.getAccessTokenExpireTime()));

        System.out.println("response"+response);



    }
}