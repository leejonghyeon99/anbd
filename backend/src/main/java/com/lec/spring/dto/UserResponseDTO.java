package com.lec.spring.dto;

import com.lec.spring.domain.Auth;
import com.lec.spring.domain.Region;
import com.lec.spring.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private Integer id;
    private String username;
    private String password;
    private String name;
    private String phone_number;
    private String nickname;
    private String email;
    private Double star;
    private Auth auth;
    private String certification;
    private String region;


    // User 엔티티를 인자로 받아 UserResponseDTO 객체를 생성하고 반환
    public static UserResponseDTO of(User user) {

        return UserResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .password(user.getPassword()) // 비밀번호를 포함시킬지는 보안 정책에 따라 결정해야 합니다.
                .name(user.getName())
                .phone_number(user.getPhone_number()) // User 클래스의 필드명에 따라 조정 필요
                .nickname(user.getNickname())
                .email(user.getEmail())
                .star(user.getStar())
                .auth(user.getAuth()) // Auth 엔티티 전체를 포함시킬지, 아니면 특정 필드만 포함시킬지 결정 필요
                .certification(user.getCertification()) // User 클래스의 해당 필드에 따라 조정 필요
                .region(user.getRegion())
                .build();
    }
}
