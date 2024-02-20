package com.lec.spring.controller;

import com.lec.spring.dto.email.EmailVerificationResult;
import com.lec.spring.service.MailService;
import com.lec.spring.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class MailController {

    private final UserService userService;

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
        EmailVerificationResult response = userService.verifiedCode(email, code);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
