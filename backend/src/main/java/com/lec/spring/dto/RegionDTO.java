package com.lec.spring.dto;

import com.lec.spring.domain.User;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegionDTO {

    private Integer id;
    private String name;
    private User user;
}