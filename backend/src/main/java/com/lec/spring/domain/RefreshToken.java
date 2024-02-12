package com.lec.spring.domain;

import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "`key`", nullable = false, length = 128)
    private String key;

    @Column(nullable = false, length = 150)
    private String value;

    public RefreshToken updateValue(String token){
        this.value = token;
        return this;
    }
}
