package com.lec.spring.controller;

import com.lec.spring.domain.Status;
import com.lec.spring.domain.User;
import com.lec.spring.dto.*;
import com.lec.spring.service.UserService;
import com.lec.spring.service.user.UserInfoService;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserInfoService userInfoService;

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
        System.out.println(userRequestDTO.getPassword());
        return ResponseEntity.ok(userService.update(userRequestDTO));
    }

    @PutMapping("/updatePassword")
    public ResponseEntity<?> updatePassword(@RequestBody UserRequestDTO userRequestDTO){
        return ResponseEntity.ok(userService.updatePassword(userRequestDTO));
    }

    @GetMapping("/info")
    public ResponseEntity<User> getUserInfo() {
        return ResponseEntity.ok(userService.getUser().get());
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@RequestHeader(value = "Authorization") String tokenHeader){
        if (tokenHeader != null && tokenHeader.startsWith("Bearer ")){
            String accessToken = tokenHeader.substring(7);
            String message = userService.logout(accessToken);
            return ResponseEntity.ok().body(Map.of("message", message));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid Authorization header."));
        }
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<?> deleteUser(Authentication authentication){
        String userId = authentication.getName();
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok().body(Map.of("message", "Account deleted successfully."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Failed to delete account."));
        }
    }












    //유저 정보
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> profile(){
        User user = userService.getUser().orElse(null);
        if(user == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND); //404
        }
        return new ResponseEntity<>(UserDTO.toDto(user), HttpStatus.OK); // 200
    }

    //판매중, 판매완료, 예약중
    @GetMapping("/product-status")
    public ResponseEntity<Page> getProductList(
            @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size,
            @RequestParam(name = "status", required = false)Status status
            ){
        return new ResponseEntity<>(userInfoService.getProductList(page, size, status),HttpStatus.OK);
    }

    //관심 게시글
    @GetMapping("/wish-list")
    public ResponseEntity<Page> getWishList(
            @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size
    ){
        return new ResponseEntity<>(userInfoService.getWishList(page, size),HttpStatus.OK);
    }

    @GetMapping("/test")
    public void test(){
        userInfoService.test();
    }







}
