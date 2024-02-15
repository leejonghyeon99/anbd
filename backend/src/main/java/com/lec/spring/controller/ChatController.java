package com.lec.spring.controller;

import com.lec.spring.domain.Chat;
import com.lec.spring.domain.ChatRoom;
import com.lec.spring.dto.ChatDTO;
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

import java.util.HashSet;
import java.util.Set;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private static Set<Integer> userList = new HashSet<>();

    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chat/{id}")
    public void sendMessage(@Payload ChatDTO chatDTO, @DestinationVariable Integer id) {
        this.simpMessagingTemplate.convertAndSend("/queue/addChatToClient/"+ id, chatDTO);
    }

    @MessageMapping("/join")
    public void joinUser(@Payload Integer userId) {
        userList.add(userId);
        userList.forEach(user -> System.out.println(user));
    }

}
