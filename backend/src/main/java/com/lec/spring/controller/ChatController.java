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
import com.lec.spring.repository.ChatRepository;
import com.lec.spring.repository.ChatRoomRepository;
import com.lec.spring.repository.UserRepository;
import com.lec.spring.repository.product.ProductRepository;
import com.lec.spring.service.UserService;
import com.lec.spring.service.chat.ChatRoomService;
import com.lec.spring.service.chat.ChatService;
import com.lec.spring.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

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
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Autowired
    private UserService userService;
    @Autowired
    private ProductService productService;
    @Autowired
    private ChatRoomService chatRoomService;
    @Autowired
    private ChatService chatService;

    @MessageMapping("/api/ws/rooms/{roomId}/send")
    @SendTo("/queue/public/rooms/{roomId}")
    public ChatDTO sendMessage(@Payload ChatDTO chatDTO, @DestinationVariable Integer id) {    // ChatRoom id
        System.out.println(chatDTO);
        this.simpMessagingTemplate.convertAndSend("/queue/addChatToClient/"+ id, chatDTO);
        return null;
    }

//    @MessageMapping("/chat/{id}")
//    @SendTo("/queue/addChatToClient/{id}")
//    public ChatDTO sendMessage(@Payload ChatDTO chatDTO, @DestinationVariable Integer id) {
//
//        User user = userRepository.findById(Integer.valueOf(chatDTO.getUser())).orElseThrow(() -> new RuntimeException("User not found"));
//        ChatRoom chatRoom = chatRoomRepository.findById(chatDTO.getChatRoom().getId()).orElseThrow(() -> new RuntimeException("Chat room not found"));
//
//        System.out.println("유저:" + user);
//        // 메시지 저장 로직
//        Chat chat = chatService.saveMessage(chatDTO.getMessage(), user, chatRoom);
//
//        ChatDTO chatDTO1 = ChatDTO.toDto(chat);
//        return chatDTO1;
//    }

//    @MessageMapping("/join")
//    public void joinUser(@Payload Integer id) {     // ← User의 ID
//        userList.add(id);
////        userList.forEach(user -> System.out.println(user));
//        userList.forEach(System.out::println);
//    }

    @MessageMapping("/join")
    public void joinUser(@Payload byte[] payload) {     // byte 배열 형식으로 변경
        String userId = new String(payload);  // byte 배열을 문자열로 변환
        userList.add(Integer.valueOf(userId));  // 문자열을 정수로 변환하여 사용자 ID로 추가
        userList.forEach(System.out::println);
    }


    @PostMapping("/api/chatroom/room")
//    @PreAuthorize("hasRole('ROLE_USER')") // 해당 엔드포인트에 접근하기 위해서는 ROLE_USER 권한이 필요함
    public ResponseEntity<?> createRoom(@RequestBody Map<String, String> ids) {

        User seller = userRepository.findByNickname(ids.get("sellerId")).orElse(null);
        User buyer = userRepository.findByUsername(ids.get("buyerId")).orElse(null);
        Product product = productRepository.findById(Long.parseLong(ids.get("productId"))).orElse(null);

        System.out.println("start -------------------------------------");
        System.out.println(UserDTO.toDto(seller));
        System.out.println(UserDTO.toDto(buyer));
        System.out.println(ProductDTO.toDto(product));
        System.out.println("end-------------------------------------");
        // 판매자와 구매자의 ID가 같을 때는 채팅방 생성하지 않음
        if (seller.getId().equals(buyer.getId())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Seller and buyer cannot be the same.");
        }

        // 이미 존재하는 채팅방이 있는지 확인
        ChatRoom existingRoom = chatRoomService.findRoomBySellerAndBuyer(seller.getId(), buyer.getId(), product.getId());
        if (existingRoom != null) {
            // 기존 채팅방이 있으면 해당 채팅방 ID 반환
            System.out.println(existingRoom.getId());
            return ResponseEntity.ok(ChatRoomDTO.toDto(existingRoom).getId());
        }

        // 판매자와 구매자가 뒤바뀐 경우에도 채팅방을 찾아보고 있으면 반환
        existingRoom = chatRoomService.findRoomBySellerAndBuyer(buyer.getId(), seller.getId(), product.getId());
        if (existingRoom != null) {
            System.out.println(existingRoom.getId());
            return ResponseEntity.ok(ChatRoomDTO.toDto(existingRoom).getId());
        }

        ChatRoom chatRoom = chatRoomService.createRoom(seller.getId(), buyer.getId(), product.getId());
        if (chatRoom != null) {
            System.out.println("채팅방: " + chatRoom);
            // 채팅방 생성 후 채팅방 ID를 클라이언트로 보냄
            ChatRoomDTO chatRoomDTO = ChatRoomDTO.toDto(chatRoom);
            return ResponseEntity.ok(chatRoomDTO.getId());
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create chat room");
        }

    }

    @PostMapping("/api/chat/sendMessage")
    public ResponseEntity<?> saveMessage(@RequestBody Map<String, Object> chats) {
        String message = (String) chats.get("message");

        Chat chat = chatService.saveMessage(message, (String) chats.get("userId"), (Integer) chats.get("chatRoomId"));
        ChatDTO chatDTO = ChatDTO.toDto(chat);

        return ResponseEntity.ok(chatDTO);
    }

}
