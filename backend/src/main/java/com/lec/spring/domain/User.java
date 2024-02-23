package com.lec.spring.domain;

import jakarta.persistence.*;
import jakarta.transaction.Transactional;
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

    @Column(nullable = false, length = 100)
    private String region;

    @Column(length = 20)
    private String provider;

    private String provider_id;

    // 이메일 인증을 위해 unique 추가
    @Column(nullable = false, length = 200, unique = true)
    private String email;

    @Column(nullable = false, columnDefinition = "decimal(2,1) default 0.0") //데이터베이스 레벨에서의 기본값 설정이며, 애플리케이션 레벨에서 객체를 생성할 때는 적용되지 않습니다.
    private Double star = 0.0;

    @Column(nullable = false, columnDefinition = "varchar(10) default 'ROLE_USER'")
    @Enumerated(EnumType.STRING)
    private Auth auth;

    @Column(nullable = false, columnDefinition = "varchar(10) default 'DENIED'")
    private String certification;

    private String thumbnail;

    @OneToMany(mappedBy = "user",cascade = CascadeType.REMOVE)
    private List<Product> products;


    @OneToMany(mappedBy = "user",cascade = CascadeType.REMOVE)
    private List<WishList> wishList;

    @OneToMany(mappedBy = "user",cascade = CascadeType.REMOVE)
    private List<Review> reviews;

    @OneToMany(mappedBy = "buyer")
    private List<ChatRoom> boughtRooms;

    @OneToMany(mappedBy = "seller")
    private List<ChatRoom> soldRooms;
}
