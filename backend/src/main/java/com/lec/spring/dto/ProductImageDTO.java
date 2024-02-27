package com.lec.spring.dto;

import com.lec.spring.domain.ProductImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImageDTO {

    private Integer id;
    private String originName;
    private String photoName;

    public static ProductImageDTO toDto(ProductImage entity){
        return ProductImageDTO.builder()
                .id(entity.getId())
                .originName(entity.getOriginName())
                .photoName(entity.getPhotoName())
                .build();
    }
}
