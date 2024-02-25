package com.lec.spring.controller;

import com.lec.spring.dto.email.EmailVerificationResult;
import com.lec.spring.repository.UserRepository;
import com.lec.spring.service.MailService;
import com.lec.spring.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class MailController {

    private final UserService userService;
    private final MailService mailService;
    private final UserRepository userRepository;

    @PostMapping("/verification-requests")
    public ResponseEntity sendMessage(@RequestParam("email") String email){
        userService.sendCodeToEmail(email);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/verifications")
    public ResponseEntity verificationEmail(
            @RequestParam("email") String email,
            @RequestParam("code") String code
    ) {
        // 사용자 서비스를 통해 이메일이 이미 사용 중인지 확인
        boolean isEmailAlreadyInUse = userRepository.existsByEmail(email);

        if (isEmailAlreadyInUse) {
            // 중복된 이메일인 경우, 에러 메시지 대신 상태 정보를 포함하여 반환
            return ResponseEntity.ok(Map.of(
                    "status", "error",
                    "message", "이미 가입된 이메일입니다."
            ));
        }
        EmailVerificationResult response = userService.verifiedCode(email, code);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
