package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.*;
import net.minidev.json.annotate.JsonIgnore;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
    @JoinColumn(name = "category_id")
    private Category category;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private User user;

    // 첨부파일
    @OneToMany(cascade = CascadeType.ALL)   //cascade = CascadeType.All 삭제 등의 동작 발생시 child 자동 삭제
    @JoinColumn(name="product_id")
    @ToString.Exclude
    @Builder.Default
    private List<ProductImage> fileList = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.REMOVE)
    private List<WishList> wishList;

    @OneToMany(mappedBy = "product", cascade = CascadeType.REMOVE)
    private List<Review> reviews;

//    @OneToMany(mappedBy = "product",cascade = CascadeType.REMOVE)
//    private List<ChatRoom> chatRooms;
}