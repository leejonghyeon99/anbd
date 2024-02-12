package com.lec.spring.dto;

import com.lec.spring.domain.User;
import com.lec.spring.domain.WishList;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishListDTO {

    private Integer id;
    private UserDTO user;
    private ProductDTO product;

    public static WishListDTO toDto(WishList entity){
        return WishListDTO.builder()
                .id(entity.getId())
                .user(UserDTO.toDto(entity.getUser()))
                .product(ProductDTO.toDto(entity.getProduct()))
                .build();
    }

    public static List<WishListDTO> toDtoList(List<WishList> wishLists) {
        return wishLists.stream()
                .map(WishListDTO::toDto)
                .collect(Collectors.toList());
    }
}