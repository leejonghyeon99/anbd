package com.lec.spring.controller;

import com.lec.spring.domain.User;
import com.lec.spring.dto.*;
import com.lec.spring.jwt.SecurityUtil;
import com.lec.spring.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<UserResponseDTO> signup(@RequestBody UserRequestDTO userRequestDTO){
        return ResponseEntity.ok(userService.signup(userRequestDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDTO> login(@RequestBody UserRequestDTO userRequestDTO){
        return ResponseEntity.ok(userService.login(userRequestDTO));
    }

    @PostMapping("/passwordCheck")
    public ResponseEntity<?> passwordCheck(@RequestBody UserRequestDTO userRequestDTO) {
        boolean isValid = userService.verifyPassword(userRequestDTO.getUsername(), userRequestDTO.getPassword());

        if (isValid) {
            return ResponseEntity.ok().body(Map.of("isValid", true));
        } else {
            return ResponseEntity.badRequest().body(Map.of("isValid", false, "message", "비밀번호가 일치하지 않습니다."));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody UserRequestDTO userRequestDTO){
        return ResponseEntity.ok(userService.update(userRequestDTO));
    }

    @GetMapping("/info")
    public ResponseEntity<User> getUserInfo() {
        return ResponseEntity.ok(userService.getUser().get());
    }

    @PostMapping("/reissue")
    public ResponseEntity<TokenDTO> reissue(@RequestBody TokenRequestDTO tokenRequestDTO){
        return ResponseEntity.ok(userService.reissue(tokenRequestDTO));
    }

}
