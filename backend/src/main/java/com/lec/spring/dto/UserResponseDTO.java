package com.lec.spring.dto;

import com.lec.spring.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {

    private String id;
    private String password;
    private String email;

    // User 엔티티를 인자로 받아 UserResponseDTO 객체를 생성하고 반환
    public static UserResponseDTO of(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.email = user.getEmail();
        // 필요한 데이터를 User 엔티티로부터 가져와서 dto에 설정
        return dto;
    }
}
