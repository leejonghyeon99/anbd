package com.lec.spring.dto;

import com.lec.spring.domain.Product;
import com.lec.spring.domain.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
    private LocalDateTime refreshedAt;
    private CategoryDTO category;
    private String user;
    private long viewCnt;
    private LocalDateTime createdAt;
    private List<ProductImageDTO> fileList;


    public static ProductDTO toDto(Product entity) {
        return ProductDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .status(entity.getStatus())
                .location(entity.getLocation())
                .createdAt(entity.getCreatedAt())
                .refreshedAt(entity.getRefreshedAt())
                .viewCnt(entity.getViewCnt())
                .fileList(entity.getFileList().stream().map(ProductImageDTO::toDto).collect(Collectors.toList()))
                .category(CategoryDTO.toDto(entity.getCategory()))
                .user(UserDTO.toDto(entity.getUser()).getNickname())
                .build();
    }

    // 엔티티 리스트를 DTO 리스트로 변환하는 메소드
    public static List<ProductDTO> toDtoList(List<Product> products) {
        return products.stream()
                .map(ProductDTO::toDto)
                .collect(Collectors.toList());
    }

}