package com.lec.spring.dto;

import com.lec.spring.domain.Region;
import com.lec.spring.domain.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegionDTO {

    private Integer id;
    private String name;
    private UserDTO user;

    public static RegionDTO toDto(Region entity){
        return RegionDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .user(UserDTO.toDto(entity.getUser()))
                .build();
    }

    public static List<RegionDTO> toDtoList(List<Region> regions) {
        return regions.stream()
                .map(RegionDTO::toDto)
                .collect(Collectors.toList());
    }
}