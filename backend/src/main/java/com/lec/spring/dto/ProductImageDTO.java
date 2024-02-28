package com.lec.spring.dto;

import com.lec.spring.domain.ProductImage;

import lombok.*;

@Getter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImageDTO {
    private Integer id;
    private String originName;
    private String photoName;

    // 생성자 생략

    public static ProductImageDTO toDto(ProductImage productImage) {
        return ProductImageDTO.builder()
                .id(productImage.getId())
                .originName(productImage.getOriginName())
                .photoName(productImage.getPhotoName())
                .build();
    }
}


