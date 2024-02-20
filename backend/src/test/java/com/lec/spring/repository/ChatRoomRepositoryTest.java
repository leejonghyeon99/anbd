package com.lec.spring.repository;

import com.lec.spring.domain.*;
import com.lec.spring.dto.UserDTO;
import com.lec.spring.repository.product.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ChatRoomRepositoryTest {


    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Test
    void test(){

        User seller = User.builder()
                .name("testname")
                .nickname("testNickName")
                .email("ttt@mail.com")
                .password("1234")
                .auth(Auth.ROLE_USER)
                .phone_number("01012341234")
                .certification("1")
                .star(3.3)
                .username("tetUername")
                .build();

        User buyer = User.builder()
                .name("testname2")
                .nickname("testNickName2")
                .email("ttt2@mail.com")
                .password("12345")
                .auth(Auth.ROLE_USER)
                .phone_number("01012341235")
                .certification("0")
                .star(3.3)
                .username("tetUername2")
                .build();


        userRepository.save(seller);
        userRepository.save(buyer);

        Product product = Product.builder()
                .title("물건사세용")
                .description("얼른사주세요")
                .price(20000)
                .status(Status.SALE)
                .user(seller)
                .build();

        productRepository.save(product);

        ChatRoom chatRoom = ChatRoom.builder()
                .seller(seller)
                .buyer(buyer)
                .product(product)
                .build();

        chatRoomRepository.save(chatRoom);

        Chat chat1 = Chat.builder()
                .user(seller)
                .message("판매자이비다.")
                .chatRoom(chatRoom)
                .build();

        Chat chat2 = Chat.builder()
                .user(buyer)
                .message("구매자입니다.")
                .chatRoom(chatRoom)
                .build();

        chatRepository.saveAndFlush(chat1);
        chatRepository.saveAndFlush(chat2);


    }

}