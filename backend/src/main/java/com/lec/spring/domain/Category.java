package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 20)
    private String main;

    @Column(nullable = false, length = 20, unique = true)
    private String sub;

    @OneToMany(mappedBy = "category")
    private List<Product> products;
}
