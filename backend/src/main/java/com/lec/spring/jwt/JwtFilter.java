package com.lec.spring.jwt;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter{
    
    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";
    
    private final TokenProvider tokenProvider;



    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // 1. Request Header 에서 토큰 꺼내기
        String jwt = resolveToken(request);


        // 2. 토큰 유효성 검사
        // 정상토큰이면 해당 토큰을 authntication에 저장해서 securitycontext에 저장
        if(StringUtils.hasText(jwt) && tokenProvider.tokenValidation(jwt)){

            Authentication authentication = tokenProvider.getAuthentication(jwt);

            SecurityContextHolder.getContext().setAuthentication(authentication); // getcontext 작동안함
        }

        filterChain.doFilter(request, response);
    }

    // resolveToken 메소드
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)){
            return bearerToken.split(" ")[1].trim();
        }
        return null;
    }
}
