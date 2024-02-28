package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.*;
import net.minidev.json.annotate.JsonIgnore;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    private Integer price;

    @Column(nullable = false, columnDefinition = "varchar(10) default 'SALE'")
    @Enumerated(value = EnumType.STRING)    //추가
    private Status status;

    private String location;

    @Column(nullable = false, columnDefinition = "bigint default 0")
    private long viewCnt;

    @Column(columnDefinition = "datetime default now()")
    private LocalDateTime refreshedAt;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @ToString.Exclude
//    @JsonIgnore
    private Category category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @ToString.Exclude
//    @JsonIgnore
    private User user;

    // 첨부파일
    @OneToMany(cascade = CascadeType.ALL)   //cascade = CascadeType.All 삭제 등의 동작 발생시 child 자동 삭제
    @JoinColumn(name="product_id")
    @JsonIgnore
    @ToString.Exclude
    @Builder.Default
    private List<ProductImage> fileList = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.REMOVE)
//    @JsonIgnore
    private List<WishList> wishList;

    @OneToMany(mappedBy = "product", cascade = CascadeType.REMOVE)
//    @JsonIgnore
    private List<Review> reviews;

//    @OneToMany(mappedBy = "product",cascade = CascadeType.REMOVE)
//    private List<ChatRoom> chatRooms;
}