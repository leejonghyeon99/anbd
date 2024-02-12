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
    private UserDTO user;

    public static ProductDTO toDto(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .status(product.getStatus())
                .location(product.getLocation())
                .middleCategory(product.getMiddleCategory())
                .refreshedAt(product.getRefreshedAt())
                .category(CategoryDTO.toDto(product.getCategory()))
                .user(UserDTO.toDto(product.getUser()))
                .build();
    }

    // 엔티티 리스트를 DTO 리스트로 변환하는 메소드
    public static List<ProductDTO> toDtoList(List<Product> products) {
        return products.stream()
                .map(ProductDTO::toDto)
                .collect(Collectors.toList());
    }
}
