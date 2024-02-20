package com.lec.spring.dto;

import com.lec.spring.domain.Auth;
import com.lec.spring.domain.Region;
import com.lec.spring.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Integer id;
    private String username;
    private String name;
    private String phone_number;
    private String nickname;
    private String provider;
    private String provider_id;
    private String email;
    private Double star;
    private Auth auth;
    private String createdAt;
    private String certification;
    private String thumbnail;
    private List<Region> regions;


    public static UserDTO toDto(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .phone_number(user.getPhone_number())
                .nickname(user.getNickname())
                .provider(user.getProvider())
                .provider_id(user.getProvider_id())
                .email(user.getEmail())
                .star(user.getStar())
                .auth(user.getAuth())
                .createdAt(user.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH시 mm분")))
                .certification(user.getCertification())
                .thumbnail(user.getThumbnail())
                .build();
    }

    public static List<UserDTO> toDtoList(List<User> users) {
        return users.stream()
                .map(UserDTO::toDto)
                .collect(Collectors.toList());
    }
}
