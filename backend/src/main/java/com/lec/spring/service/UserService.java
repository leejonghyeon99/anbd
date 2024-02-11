package com.lec.spring.service;

import com.lec.spring.domain.RefreshToken;
import com.lec.spring.domain.User;
import com.lec.spring.dto.TokenDTO;
import com.lec.spring.dto.UserDTO;
import com.lec.spring.jwt.TokenProvider;
import com.lec.spring.repository.RefreshTokenRepository;
import com.lec.spring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

//    @Transactional
//    public UserDTO signup(UserDTO userDTO){
//        if (userRepository.existsByEmail(userDTO.getEmail())){
//            throw new RuntimeException("이미 가입되어 있는 유저입니다.");
//        }
//
//        User user = userDTO.toUser(passwordEncoder);
//        return UserDTO.of(userRepository.save(user));
//    }

//    @Transactional
//    public TokenDTO login(UserDTO userDTO){
//
//        UsernamePasswordAuthenticationToken authenticationToken = userDTO.setAuth(getClass());
//
//        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
//
//        TokenDTO tokenDTO = tokenProvider.createTokenDto(authentication);
//
//        RefreshToken refreshToken = RefreshToken.builder()
//                .key(authentication.getName())
//                .value(tokenDTO.getRefreshToken())
//                .build();
//
//        refreshTokenRepository.save(refreshToken);
//
//        return tokenDTO;
//    }

//    @Transactional
//    public TokenDTO reissue(TokenDTO tokenDTO){
//        if(!tokenProvider.tokenValidation(tokenDTO.getRefreshToken())){
//            throw new RuntimeException("Refresh Token 이 유효하지 않습니다.");
//        }
//
//        Authentication authentication = tokenProvider.getAuthentication(tokenDTO.getAccessToken());
//
//        RefreshToken refreshToken = refreshTokenRepository.findByKey(authentication.getName())
//                .orElseThrow(() -> new RuntimeException("로그아웃 된 사용자입니다."));
//
//        if (!refreshToken.getValue().equals(tokenDTO.getRefreshToken())){
//            throw new RuntimeException("토큰의 유저 정보가 일치하지 않습니다.");
//        }
//
//        TokenDTO tokenDTO = tokenProvider.createTokenDto(authentication);
//
//        RefreshToken newRefreshToken = refreshToken.updateValue(tokenDTO.getRefreshToken());
//        refreshTokenRepository.save(newRefreshToken);
//
//        return tokenDTO;
//
//    }
}
