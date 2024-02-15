package com.lec.spring.controller;

import com.lec.spring.domain.Chat;
import com.lec.spring.domain.ChatRoom;
import com.lec.spring.domain.User;
import com.lec.spring.dto.ChatDTO;
import com.lec.spring.repository.ChatRoomRepository;
import com.lec.spring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private static Set<Integer> userList = new HashSet<>();

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    @MessageMapping("/chat/{id}")
    public void sendMessage(@Payload ChatDTO chatDTO, @DestinationVariable Integer id) {
        this.simpMessagingTemplate.convertAndSend("/queue/addChatToClient/"+ id, chatDTO);
    }

    @MessageMapping("/join")
    public void joinUser(@Payload Integer userId) {
        userList.add(userId);
        userList.forEach(user -> System.out.println(user));

        // 채팅방 생성 및 사용자 추가
        ChatRoom chatRoom = new ChatRoom();
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found")); // userId로 사용자 검색

        chatRoom.setUsers(Collections.singletonList(user)); // 단일 사용자로 설정
        chatRoomRepository.saveAndFlush(chatRoom); // 채팅방 저장
    }

}
