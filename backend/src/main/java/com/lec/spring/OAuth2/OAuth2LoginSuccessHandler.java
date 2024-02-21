package com.lec.spring.OAuth2;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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

        // OAuth 인증 성공 후, Authentication 객체를 사용하여 토큰 생성
        TokenDTO tokenDTO = tokenProvider.createTokenDto(authentication);

        // RefreshToken 생성 및 저장
        RefreshToken refreshToken = RefreshToken.builder()
                .key(authentication.getName()) // OAuth 인증으로 얻은 사용자 식별 정보를 key로 사용
                .value(tokenDTO.getRefreshToken())
                .build();

        refreshTokenRepository.save(refreshToken);

        // 클라이언트에 토큰 정보 전송 (예: 응답 헤더 또는 본문에 토큰 정보 추가)
        // 실제 응답 방식은 애플리케이션의 요구사항에 따라 달라질 수 있습니다.
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();
        out.print(new ObjectMapper().writeValueAsString(tokenDTO)); // Jackson 라이브러리를 사용하여 TokenDTO를 JSON으로 변환
        out.flush();

    }
}