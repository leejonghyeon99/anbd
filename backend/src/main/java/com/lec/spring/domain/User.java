package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntity{


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 100)
    private String password;

    @Transient
    private String rePassword;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 15)
    private String phone_number;

    @Column(nullable = false, length = 30)
    private String nickname;

    @Column(length = 20)
    private String provider;

    private String provider_id;

    @Column(nullable = false, length = 200)
    private String email;

    @Column(nullable = false, columnDefinition = "decimal(2,1) default 0.0")
    private Double star;

    @Column(nullable = false, columnDefinition = "varchar(10) default 'ROLE_USER'")
    @Enumerated(EnumType.STRING)
    private Auth auth;

    @Column(nullable = false, columnDefinition = "boolean default 0")
    private boolean certification;

    private String thumbnail;

    @OneToMany(mappedBy = "user",cascade = CascadeType.REMOVE)
    private List<Product> products;

    @OneToMany(mappedBy = "user",cascade = CascadeType.REMOVE)
    private List<Region> regions;

    @OneToMany(mappedBy = "user",cascade = CascadeType.REMOVE)
    private List<WishList> wishList;

    @OneToMany(mappedBy = "user",cascade = CascadeType.REMOVE)
    private List<Review> reviews;

    @OneToMany(mappedBy = "user",cascade = CascadeType.REMOVE)
    private List<ChatRoom> chatRooms;
}
