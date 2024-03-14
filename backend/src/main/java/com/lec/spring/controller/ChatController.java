package com.lec.spring.controller;


import com.lec.spring.dto.ChatDTO;
import com.lec.spring.dto.ChatRoomDTO;
import com.lec.spring.dto.RoomDto;
import com.lec.spring.service.UserService;
import com.lec.spring.service.chat.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final UserService userService;

    @MessageMapping("/{roomId}")
    @SendTo("/send/{roomId}")
    public ResponseEntity<ChatDTO> handleChatMessage(@DestinationVariable Integer roomId, @RequestBody RoomDto roomDto) {
        System.out.println("메세지 요청받음");
        String processedMessage = "User in room " + roomId + ": " + roomDto.getMessage();
        System.out.println(processedMessage);
        return new ResponseEntity<>(chatService.createChat(roomDto.getMessage(), roomId, roomDto.getUsername()), HttpStatus.OK);
    }

    @PostMapping("/room")
    public ResponseEntity<ChatRoomDTO> createRoom(@RequestBody RoomDto roomDto){
        System.out.println("-".repeat(50));
        System.out.println(roomDto.getUsername() + " / " + roomDto.getProductId());
        return new ResponseEntity<>(chatService.createRoom(roomDto.getUsername(), roomDto.getProductId()), HttpStatus.CREATED); //201
    }

    @GetMapping("/room")
    public ResponseEntity<List<ChatDTO>> chatLog(Integer roomId){
        return new ResponseEntity<>(chatService.logChats(roomId),HttpStatus.OK);
    }

    @GetMapping("/rooms")
    private ResponseEntity<List<ChatRoomDTO>> rooms(){
        return new ResponseEntity<>(chatService.chatRooms(), HttpStatus.OK);
    }


}
