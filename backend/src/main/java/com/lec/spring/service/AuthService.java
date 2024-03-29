package com.lec.spring.service;

import com.lec.spring.domain.Auth;
import com.lec.spring.domain.RefreshToken;
import com.lec.spring.domain.User;
import com.lec.spring.dto.TokenDTO;
import com.lec.spring.dto.TokenRequestDTO;
import com.lec.spring.jwt.TokenProvider;
import com.lec.spring.repository.RefreshTokenRepository;
import com.lec.spring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final TokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;


    @Transactional
    public TokenDTO reissue(TokenRequestDTO tokenRequestDTO){
        // username을 기반으로 사용자 정보 조회
        User user = userRepository.findByUsername(tokenRequestDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // username에 해당하는 기존 리프레쉬 토큰 조회
        Optional<RefreshToken> refreshToken = refreshTokenRepository.findByUsername(user.getUsername());

        RefreshToken newRefreshToken;
        if (refreshToken.isPresent()) {
            // 기존 토큰이 있다면, 값을 업데이트
            newRefreshToken = refreshToken.get();
        } else {
            // 기존 토큰이 없다면, 새로 생성
            newRefreshToken = new RefreshToken();
            newRefreshToken.setUsername(user.getUsername());
        }

        // 사용자의 실제 권한 조회
        Auth userAuth = user.getAuth(); // 사용자의 역할을 가져오는 가상의 메서드

        // 사용자의 권한을 설정
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(userAuth.getKey()));

        // 사용자 정보와 권한 정보로부터 Authentication 객체 생성
        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getUsername(), null, authorities);

        // 유저네임 기반으로 토큰 재발급
        TokenDTO tokenDTO = tokenProvider.createTokenDto(authentication);

        // 리프레쉬 토큰 업데이트 및 저장
        newRefreshToken.setValue(tokenDTO.getRefreshToken());
        refreshTokenRepository.save(newRefreshToken);

        return tokenDTO;
    }
}
