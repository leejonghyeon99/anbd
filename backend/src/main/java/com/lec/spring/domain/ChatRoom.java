package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class ChatRoom {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

    @ManyToOne
    @JoinColumn(name = "buyer_id")
    private User buyer;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @ToString.Exclude
    private Product product;

    @OneToMany(mappedBy = "chatRoom")
    private List<Chat> chats;


//    @OneToMany(mappedBy = "chatRoom")
//    private List<Chat> chat;
}
