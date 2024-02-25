package com.lec.spring.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lec.spring.domain.Chat;
import com.lec.spring.domain.ChatRoom;
import com.lec.spring.domain.Product;
import com.lec.spring.domain.User;
import com.lec.spring.dto.ChatDTO;
import com.lec.spring.dto.ChatRoomDTO;
import com.lec.spring.dto.ProductDTO;
import com.lec.spring.repository.ChatRoomRepository;
import com.lec.spring.repository.UserRepository;
import com.lec.spring.service.UserService;
import com.lec.spring.service.chat.ChatService;
import com.lec.spring.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private static Set<Integer> userList = new HashSet<>();

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ObjectMapper objectMapper;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    @Autowired
    private UserService userService;
    @Autowired
    private ProductService productService;
    @Autowired
    private ChatService chatService;

    @MessageMapping("/chat/{id}")
    public void sendMessage(@Payload ChatDTO chatDTO, @DestinationVariable Integer id) {
        this.simpMessagingTemplate.convertAndSend("/queue/addChatToClient/"+ id, chatDTO);
    }

//    @MessageMapping("/join")
//    public void joinUser(@Payload Integer userId) {
//        // 채팅방 생성 및 사용자 추가
//        User currentUser = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // 채팅방 생성
//        ChatRoom chatRoom = new ChatRoom();
//        chatRoom.setBuyer(currentUser);
//        chatRoomRepository.saveAndFlush(chatRoom);
//        System.out.println(chatRoom);
//
//        // 채팅방 생성 후 채팅방 ID를 클라이언트로 보냄
//        ChatRoomDTO chatRoomDTO = ChatRoomDTO.toDto(chatRoom);
//        simpMessagingTemplate.convertAndSend("/queue/sendChatRoomIdToClient/" + userId, chatRoomDTO.getId());
//    }

//    @MessageMapping("/join")
////    @PostMapping("/join")
//    public void joinUser(@Payload Integer id) {     // ← User 의 ID
//        userList.add(id);
//        userList.forEach(System.out::println);
//
//        // 채팅방 생성 및 사용자 추가
//        User currentUser = userService.getLoggedInUser();
//        User postUser = productService.getProductById(Long.valueOf(id)).getUser();
//        System.out.println("현재 로그인한 유저 : " + currentUser);
//        System.out.println("글을 작성한 유저 : " + postUser);
//
//        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
//        ChatRoom chatRoom = new ChatRoom();
//        chatRoom.setBuyer(currentUser);
//        chatRoom.setSeller(postUser);
//        chatRoom.setSeller((User) Collections.singletonList(user));
//        chatRoomRepository.saveAndFlush(chatRoom);
//        System.out.println(chatRoom);
//
//        // 채팅방 생성 후 채팅방 ID를 클라이언트로 보냄
//        ChatRoomDTO chatRoomDTO = ChatRoomDTO.toDto(chatRoom);
//        this.simpMessagingTemplate.convertAndSend("/queue/sendChatRoomIdToClient/" + id, chatRoomDTO.getId());
//    }

    @PostMapping("/chatroom/room")
    public void createRoom(@RequestBody Map<String, String> ids) {
        ChatRoom chatRoom = chatService.createRoom(Integer.parseInt(ids.get("seller")),Integer.parseInt(ids.get("buyer")), Long.parseLong(ids.get("product")));

        if (chatRoom != null) {
            System.out.println("채팅방 만들어졌을까..." + chatRoom);

            // 채팅방 생성 후 채팅방 ID를 클라이언트로 보냄
            ChatRoomDTO chatRoomDTO = ChatRoomDTO.toDto(chatRoom);
            this.simpMessagingTemplate.convertAndSend("/queue/sendChatRoomIdToClient", chatRoomDTO.getId());
        } else {
            System.out.println("채팅방 생성에 실패했습니다.");
            // 채팅방 생성에 실패했음을 클라이언트에게 알릴 수 있는 처리를 해줄 수 있습니다.
        }
    }

//    @PostMapping("/chatroom/room")
//    public void createRoom(@Payload Integer id) {
//                // 채팅방 생성 및 사용자 추가
//        User currentUser = userService.getLoggedInUser();
//        User postUser = productService.getProductById(Long.valueOf(id)).getUser();
//        System.out.println("현재 로그인한 유저 : " + currentUser);
//        System.out.println("글을 작성한 유저 : " + postUser);
//
//        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
//        ChatRoom chatRoom = new ChatRoom();
//        chatRoom.setBuyer(currentUser);
//        chatRoom.setSeller(postUser);
//        chatRoom.setSeller((User) Collections.singletonList(user));
//        chatRoomRepository.saveAndFlush(chatRoom);
//        System.out.println(chatRoom);
//
//        // 채팅방 생성 후 채팅방 ID를 클라이언트로 보냄
//        ChatRoomDTO chatRoomDTO = ChatRoomDTO.toDto(chatRoom);
//        this.simpMessagingTemplate.convertAndSend("/queue/sendChatRoomIdToClient/" + id, chatRoomDTO.getId());
//    }
}
