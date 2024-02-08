package com.lec.spring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishListDTO {

    private Integer id;
    private UserDTO user;
    private ProductDTO product;
}