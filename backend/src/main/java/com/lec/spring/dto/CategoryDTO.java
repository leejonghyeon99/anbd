package com.lec.spring.dto;

import com.lec.spring.domain.Category;
import com.lec.spring.domain.Product;
import com.lec.spring.domain.User;
import jakarta.persistence.*;
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
public class CategoryDTO{

    private Integer id;
    private String main;
    private String sub;

    public static Category toEntity(CategoryDTO dto){
        return Category.builder()
                .id(dto.id)
                .main(dto.getMain())
                .sub(dto.getSub())
                .build();
    }

    public static CategoryDTO toDto(Category entity) {
        return CategoryDTO.builder()
                .id(entity.getId())
                .main(entity.getMain())
                .sub(entity.getSub())
                .build();
    }

    public static List<CategoryDTO> toDtoList(List<Category> categories) {
        return categories.stream()
                .map(CategoryDTO::toDto)
                .collect(Collectors.toList());
    }

}
