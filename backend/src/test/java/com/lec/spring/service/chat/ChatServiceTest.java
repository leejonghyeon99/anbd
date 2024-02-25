package com.lec.spring.service.chat;

import com.lec.spring.domain.ChatRoom;
import com.lec.spring.dto.ChatRoomDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ChatServiceTest {

    @Autowired
    private final ChatService chatService;

    ChatServiceTest(ChatService chatService) {
        this.chatService = chatService;
    }

    @Test
    void findRoomBySellerAndBuyer() {


        ChatRoom chatRoom = chatService.findRoomBySellerAndBuyer(1,2,1L);
        System.out.println(ChatRoomDTO.toDto(chatRoom));
    }
}