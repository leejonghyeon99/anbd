package com.lec.spring.dto;

import com.lec.spring.domain.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductsDTO {

    private Long id;
    private String title;
    private String description;
    private int price;
    private Status status;
    private String location;
    private LocalDateTime refreshed_at;
    private Integer category_id;
    private Integer user_id;


}
