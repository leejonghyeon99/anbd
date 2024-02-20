package com.lec.spring.service;

import com.lec.spring.domain.Auth;
import com.lec.spring.domain.RefreshToken;
import com.lec.spring.domain.User;
import com.lec.spring.dto.TokenDTO;
import com.lec.spring.dto.TokenRequestDTO;
import com.lec.spring.dto.UserRequestDTO;
import com.lec.spring.dto.UserResponseDTO;
import com.lec.spring.dto.email.EmailVerificationResult;
import com.lec.spring.jwt.SecurityUtil;
import com.lec.spring.jwt.TokenProvider;
import com.lec.spring.repository.RefreshTokenRepository;
import com.lec.spring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {

    private static final String AUTH_CODE_PREFIX = "CODE";
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtBlacklistService jwtBlacklistService;
    private final MailService mailService;
    private final RedisService redisService;
    @Value("${spring.mail.auth-code-expiration-millis}")
    private long authCodeExpirationMillis;

    @Transactional
    public UserResponseDTO signup(UserRequestDTO userRequestDTO){
        if (userRepository.existsByUsername(userRequestDTO.getUsername())){
            throw new RuntimeException("이미 가입되어 있는 유저입니다.");
        }
        // 이메일 인증이 되면 자격증명을 승인됨으로 바꿈

        User user = userRequestDTO.toUser(passwordEncoder);

        user.setAuth(Auth.ROLE_USER);
        user.setCertification("approved");
        user.setStar(0.0);
        user.setRegion(user.getRegion());

        return UserResponseDTO.of(userRepository.save(user));
    }


    @Transactional
    public TokenDTO login(UserRequestDTO userRequestDTO){

        UsernamePasswordAuthenticationToken authenticationToken = userRequestDTO.toAuthentication();

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        System.out.println("------------------------"+authentication);
        TokenDTO tokenDTO = tokenProvider.createTokenDto(authentication);

        RefreshToken refreshToken = RefreshToken.builder()
                .key(authentication.getName())
                .value(tokenDTO.getRefreshToken())
                .build();

        refreshTokenRepository.save(refreshToken);

        return tokenDTO;
    }

    public boolean verifyPassword(String username, String inputPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("일치하는 사용자 정보를 찾지 못했습니다."));
        System.out.println(user);

        return passwordEncoder.matches(inputPassword, user.getPassword());
    }

    public UserResponseDTO update(UserRequestDTO userRequestDTO) {
        User user = userRepository.findById(userRequestDTO.getId()).orElseThrow(()->new RuntimeException("you need to update id check"));

        user.setName(userRequestDTO.getName());
        user.setNickname(userRequestDTO.getNickname());
        user.setEmail(userRequestDTO.getEmail());
        user.setPhone_number(userRequestDTO.getPhone_number());

        if (userRequestDTO.getPassword() != null && !userRequestDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        }

        User updateUser = userRepository.save(user);

        return UserResponseDTO.of(updateUser);

    }

    @Transactional
    public TokenDTO reissue(TokenRequestDTO tokenRequestDTO){
        if(!tokenProvider.tokenValidation(tokenRequestDTO.getRefreshToken())){
            throw new RuntimeException("Refresh Token 이 유효하지 않습니다.");
        }

        Authentication authentication = tokenProvider.getAuthentication(tokenRequestDTO.getAccessToken());

        RefreshToken refreshToken = refreshTokenRepository.findByKey(authentication.getName())
                .orElseThrow(() -> new RuntimeException("로그아웃 된 사용자입니다."));

        if (!refreshToken.getValue().equals(tokenRequestDTO.getRefreshToken())){
            throw new RuntimeException("토큰의 유저 정보가 일치하지 않습니다.");
        }

        TokenDTO tokenDTO = tokenProvider.createTokenDto(authentication);

        RefreshToken newRefreshToken = refreshToken.updateValue(tokenDTO.getRefreshToken());
        refreshTokenRepository.save(newRefreshToken);

        return tokenDTO;
    }

    // 현재 유저 정보 가져오기
    public Optional<User> getUser(){
        return SecurityUtil.getCurrentUserId().flatMap(userRepository::findOneWithAuthoritiesByUsername);
    }


    public String logout(String accessToken) {
       jwtBlacklistService.blacklistToken(accessToken);
        return accessToken;
    }


    public void deleteUser(String userId) {
        User user = userRepository.findByUsername(userId).orElseThrow(() -> new RuntimeException("유저정보가 없습니다."));
        userRepository.delete(user);

    }







    //이메일 인증
    public void sendCodeToEmail(String toEmail) {
        this.checkDuplicatedEmail(toEmail);
        String title = "ANBD 이메일 인증 번호";
        String code = null;
        try {
            code = this.createCode();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
        mailService.sendEmail(toEmail, title, code);
        System.out.println(AUTH_CODE_PREFIX + toEmail);
        redisService.setValues(AUTH_CODE_PREFIX + toEmail,
                code, Duration.ofMillis(this.authCodeExpirationMillis));
    }

    private void checkDuplicatedEmail(String email) {
        Optional<User> member = userRepository.findByEmail(email);
        if (member.isPresent()) {
            System.out.println("이미 존재하는 이메일");
        }
    }

    private String createCode() throws NoSuchAlgorithmException {
        int lenth = 6;
        Random random = SecureRandom.getInstanceStrong();
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < lenth; i++) {
            builder.append(random.nextInt(10));
        }
        return builder.toString();
    }

    public EmailVerificationResult verifiedCode(String email, String code) {
        this.checkDuplicatedEmail(email);
        String key = AUTH_CODE_PREFIX + email;
        String redisCode = (String) redisService.getValues(key);
        boolean authResult = redisService.checkExistsValue(key) && redisCode.equals(code);

        return EmailVerificationResult.of(authResult);
    }


}
