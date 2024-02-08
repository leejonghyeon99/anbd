package com.lec.spring.dto;

import com.lec.spring.domain.Auth;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Integer id;
    private String username;
    private String password;
    private String rePassword;
    private String name;
    private String phone_number;
    private String nickname;
    private String provider;
    private String provider_id;
    private String email;
    private Double star;
    private Auth auth;
    private boolean certification;
    private String thumbnail;
    private List<ProductDTO> products;
    private List<RegionDTO> regions;
    private List<WishListDTO> wishList;
    private List<ReviewDTO> reviews;
    private List<ChatRoomDTO> chatRooms;
}
