package com.lec.spring.service;

import com.lec.spring.domain.Auth;
import com.lec.spring.domain.RefreshToken;
import com.lec.spring.domain.User;
import com.lec.spring.dto.TokenDTO;
import com.lec.spring.dto.UserRequestDTO;
import com.lec.spring.dto.UserResponseDTO;
import com.lec.spring.dto.email.EmailVerificationResult;
import com.lec.spring.config.SecurityUtil;
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

        // 사용자 객체 생성 및 속성 설정
        User user = userRequestDTO.toUser(passwordEncoder);

        user.setAuth(Auth.ROLE_USER);
        user.setStar(0.0);
        user.setCertification("APPROVED");
        return UserResponseDTO.of(userRepository.save(user));

    }


    @Transactional
    public TokenDTO login(UserRequestDTO userRequestDTO){

        UsernamePasswordAuthenticationToken authenticationToken = userRequestDTO.toAuthentication();

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        TokenDTO tokenDTO = tokenProvider.createTokenDto(authentication);

        RefreshToken refreshToken = RefreshToken.builder()
                .username(authentication.getName())
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
        user.setRegion(userRequestDTO.getRegion());


        User updateUser = userRepository.save(user);

        return UserResponseDTO.of(updateUser);

    }

    public UserResponseDTO updatePassword(UserRequestDTO userRequestDTO) {
        User user = userRepository.findById(userRequestDTO.getId()).orElseThrow(()->new RuntimeException("you need to update id check"));

        user.setPassword(userRequestDTO.getPassword());

        if (userRequestDTO.getPassword() != null && !userRequestDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        }

        User updateUser = userRepository.save(user);

        return UserResponseDTO.of(updateUser);
    }
    // 문제점
    // 반례 ..   사용자의 로그인 시도시 토큰 발행되는데 2분주기로 변경됨
                //그러면 발급된 토큰이 갱신시 갱신 하는 동안 사이의 요청 발생시 기존 토큰으로 요청 되어 서버는 인식 불가
    //  사용자가 회원가입 시도후 서버 타임 기준으로 로그인 시도시 회원정보 못찾음
    //  고쳐야 할거.   토큰 주기를 최소 15분 이상으로 발행
    //   리프레쉬 토큰은 엑세스토큰의 1/2 간격으로 발행
    //  리프레쉬가 동작중에는 엑세스 토큰을 이전값과 새로 발급된 값을 비교해서 다른지 비교
    // 기존 토큰 <--------> 요청중 <---------> 리프레쉬 발생 ---------- 서버가 받은 토큰은 이전 토큰


    // 현재 유저 정보 가져오기
    public Optional<User> getUser(){
        User user = SecurityUtil.getCurrentUserId().flatMap(userRepository::findOneWithAuthoritiesByUsername).orElse(null);
        System.out.println("SecurityUtil user: " + user);
        return SecurityUtil.getCurrentUserId().flatMap(userRepository::findOneWithAuthoritiesByUsername);
    }

    public String logout(String accessToken) {
        // 액세스 토큰에서 사용자 이름 추출
        String username = tokenProvider.getUsernameFromToken(accessToken);

        // 사용자 이름과 연결된 리프레시 토큰 찾기 및 삭제
        refreshTokenRepository.deleteByUsername(username);

       jwtBlacklistService.blacklistToken(accessToken);
        return accessToken;
    }


    public void deleteUser(String userId) {
        User user = userRepository.findByUsername(userId).orElseThrow(() -> new RuntimeException("유저정보가 없습니다."));

        // 사용자 이름으로 리프레시 토큰 찾기 및 삭제
        refreshTokenRepository.deleteByUsername(user.getUsername());

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
        System.out.println(authResult);


        return EmailVerificationResult.of(authResult);
    }

}
