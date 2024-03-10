package com.lec.spring.controller;


import com.lec.spring.domain.Chat;
import com.lec.spring.dto.UserDTO;
import com.lec.spring.service.UserService;
import com.lec.spring.service.chat.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final UserService userService;

    @MessageMapping("/{roomId}")
    @SendTo("/send/{roomId}")
    public String handleChatMessage(@DestinationVariable String roomId, String message) {
        System.out.println("메세지 요청받음");
        String processedMessage = "User in room " + roomId + ": " + message;
        System.out.println(processedMessage);
        System.out.println(userService.getUser().get().getName());
        return processedMessage;
    }
}
