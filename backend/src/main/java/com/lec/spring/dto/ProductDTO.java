package com.lec.spring.dto;

import com.lec.spring.domain.Product;
import com.lec.spring.domain.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {

    private Long id;
    private String title;
    private String description;
    private int price;
    private Status status;
    private String location;
    private String middleCategory;
    private LocalDateTime refreshedAt;
    private CategoryDTO category;
    private String user;
    private String userProfile;

    public static ProductDTO toDto(Product entity) {
        return ProductDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .status(entity.getStatus())
                .location(entity.getLocation())
                .middleCategory(entity.getMiddleCategory())
                .refreshedAt(entity.getRefreshedAt())
                .category(CategoryDTO.toDto(entity.getCategory()))
//                .user(UserDTO.toDto(entity.getUser()).getNickname())
//                .userProfile("profile/"+UserDTO.toDto(entity.getUser()).getId())
                .build();
    }

    // 엔티티 리스트를 DTO 리스트로 변환하는 메소드
    public static List<ProductDTO> toDtoList(List<Product> products) {
        return products.stream()
                .map(ProductDTO::toDto)
                .collect(Collectors.toList());
    }
}
