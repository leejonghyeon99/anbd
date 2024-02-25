package com.lec.spring.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lec.spring.domain.Chat;
import com.lec.spring.domain.ChatRoom;
import com.lec.spring.domain.Product;
import com.lec.spring.domain.User;
import com.lec.spring.dto.ChatDTO;
import com.lec.spring.dto.ChatRoomDTO;
import com.lec.spring.dto.ProductDTO;
import com.lec.spring.dto.UserDTO;
import com.lec.spring.repository.ChatRoomRepository;
import com.lec.spring.repository.UserRepository;
import com.lec.spring.repository.product.ProductRepository;
import com.lec.spring.service.UserService;
import com.lec.spring.service.chat.ChatService;
import com.lec.spring.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
    private final ProductRepository productRepository;

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

    @PostMapping("/api/chatroom/room")
//    @PreAuthorize("hasRole('ROLE_USER')") // 해당 엔드포인트에 접근하기 위해서는 ROLE_USER 권한이 필요함
    public ResponseEntity<?> createRoom(@RequestBody Map<String, String> ids) {

        User seller =  userRepository.findByNickname(ids.get("sellerId")).orElse(null);
        User buyer =  userRepository.findByUsername(ids.get("buyerId")).orElse(null);
        Product product = productRepository.findById(Long.parseLong(ids.get("productId"))).orElse(null);

        System.out.println("start -------------------------------------");
        System.out.println(UserDTO.toDto(seller));
        System.out.println(UserDTO.toDto(buyer));
        System.out.println(ProductDTO.toDto(product));

        System.out.println("end-------------------------------------");
        // 이미 존재하는 채팅방이 있는지 확인
        ChatRoom existingRoom = chatService.findRoomBySellerAndBuyer(seller.getId(), buyer.getId(), product.getId());
        if (existingRoom != null) {
            // 기존 채팅방이 있으면 해당 채팅방 ID 반환
            System.out.println(existingRoom.getId());
            return ResponseEntity.ok(ChatRoomDTO.toDto(existingRoom).getId());
        }

        ChatRoom chatRoom = chatService.createRoom(seller.getId(), buyer.getId(), product.getId());
        if (chatRoom != null) {
            System.out.println("채팅방: " + chatRoom);
            // 채팅방 생성 후 채팅방 ID를 클라이언트로 보냄
            ChatRoomDTO chatRoomDTO = ChatRoomDTO.toDto(chatRoom);
            return ResponseEntity.ok(chatRoomDTO.getId());
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create chat room");
        }
    }
}
