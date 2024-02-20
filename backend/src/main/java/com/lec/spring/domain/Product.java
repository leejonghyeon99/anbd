package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@EqualsAndHashCode(callSuper = true)
public class Product extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, columnDefinition = "longtext")
    private String description;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false, columnDefinition = "varchar(10) default 'SALE'")
    @Enumerated(value = EnumType.STRING)    //추가
    private Status status;

    private String location;

    private String middleCategory;

    @Column(columnDefinition = "datetime default now()")
    private LocalDateTime refreshedAt;

    @ManyToOne
    private Category category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private User user;

    @OneToMany(mappedBy = "product", cascade = CascadeType.REMOVE)
    private List<WishList> wishList;

    @OneToMany(mappedBy = "product", cascade = CascadeType.REMOVE)
    private List<Review> reviews;

}