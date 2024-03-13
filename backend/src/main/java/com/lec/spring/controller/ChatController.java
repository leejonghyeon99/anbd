package com.lec.spring.controller;


import com.lec.spring.domain.Chat;
import com.lec.spring.domain.User;
import com.lec.spring.dto.ChatDTO;
import com.lec.spring.dto.ChatRoomDTO;
import com.lec.spring.dto.RootDto;
import com.lec.spring.dto.UserDTO;
import com.lec.spring.service.UserService;
import com.lec.spring.service.chat.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final UserService userService;

    @MessageMapping("/{roomId}")
    @SendTo("/send/{roomId}")
    public ResponseEntity<ChatDTO> handleChatMessage(@DestinationVariable Integer roomId, @RequestBody RootDto rootDto) {
        System.out.println("메세지 요청받음");
        String processedMessage = "User in room " + roomId + ": " + rootDto.getMessage();
        System.out.println(processedMessage);

        return new ResponseEntity<>(chatService.createChat(rootDto.getMessage(), roomId, rootDto.getUsername()), HttpStatus.OK);
    }

    @PostMapping("/room")
    public ResponseEntity<ChatRoomDTO> createRoom(@RequestBody RootDto rootDto){
        System.out.println("-".repeat(50));
        System.out.println(rootDto.getUsername() + " / " + rootDto.getProductId());
        return new ResponseEntity<>(chatService.createRoom(rootDto.getUsername(), rootDto.getProductId()), HttpStatus.CREATED); //201
    }

    @PostMapping("/test")
    public String test(String test){
        System.out.println(test);
        return test;
    }
}
