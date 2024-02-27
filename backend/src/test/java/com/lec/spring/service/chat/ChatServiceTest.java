package com.lec.spring.service.chat;

import com.lec.spring.domain.Auth;
import com.lec.spring.domain.Chat;
import com.lec.spring.domain.ChatRoom;
import com.lec.spring.domain.User;
import com.lec.spring.dto.ChatRoomDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ChatServiceTest {

    @Autowired
    private final ChatRoomService chatRoomService;
    @Autowired
//    private final ChatService chatService;

    ChatServiceTest(ChatRoomService chatRoomService) {
        this.chatRoomService = chatRoomService;
    }

    @Test
    void findRoomBySellerAndBuyer() {


        ChatRoom chatRoom = chatRoomService.findRoomBySellerAndBuyer(1,2,1L);
        System.out.println(ChatRoomDTO.toDto(chatRoom));
    }

    @Test
    void saveTest() {

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

//
//        userRepository.save(seller);
//        userRepository.save(buyer);
//        Chat chat = chatService.saveMessage("안녕", "ㅇㅇ", "1");
    }
}