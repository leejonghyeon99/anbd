package com.lec.spring.dto;

import com.lec.spring.domain.Review;
import com.lec.spring.domain.User;
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
public class ReviewDTO {

    private Integer id;
    private String comment;
    private ProductDTO product;
    private UserDTO user;

    private static ReviewDTO toDto(Review entity){
        return ReviewDTO.builder()
                .id(entity.getId())
                .comment(entity.getComment())
                .user(UserDTO.toDto(entity.getUser()))
                .product(ProductDTO.toDto(entity.getProduct()))
                .build();
    }

    public static List<ReviewDTO> toDtoList(List<Review> reviews) {
        return reviews.stream()
                .map(ReviewDTO::toDto)
                .collect(Collectors.toList());
    }
}