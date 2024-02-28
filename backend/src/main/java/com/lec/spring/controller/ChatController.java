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

    @MessageMapping("/chat/{id}")
    public void sendMessage(@Payload ChatDTO chatDTO, @DestinationVariable Integer id) {    // Chat id
        this.simpMessagingTemplate.convertAndSend("/queue/addChatToClient/"+ id, chatDTO);
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
        // 이미 존재하는 채팅방이 있는지 확인
        ChatRoom existingRoom = chatRoomService.findRoomBySellerAndBuyer(seller.getId(), buyer.getId(), product.getId());
        if (existingRoom != null) {
            // 기존 채팅방이 있으면 해당 채팅방 ID 반환
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
    public ResponseEntity<?> saveMessage(@RequestBody Map<String, String> chats) {
        try {
            // 클라이언트로부터 전달받은 사용자 ID, 채팅방 ID, 메시지 내용 추출
            Integer userId = Integer.valueOf(chats.get("userId"));
            Integer chatRoomId = Integer.valueOf(chats.get("chatRoomId"));
            String messageContent = chats.get("message");


            // 사용자 ID를 사용하여 사용자 정보 조회
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 채팅방 ID를 사용하여 채팅방 정보 조회
            ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                    .orElseThrow(() -> new RuntimeException("Chat room not found"));

            // 채팅 메시지 저장
            Chat chat = chatService.saveMessage(messageContent, user.getId(), chatRoom.getId());

            // 저장된 채팅 메시지를 클라이언트로 반환
            ChatDTO chatDTO = ChatDTO.toDto(chat);
            return ResponseEntity.ok(chatDTO);
        } catch (NumberFormatException e) {
            // 사용자 ID 또는 채팅방 ID가 잘못된 형식으로 제공된 경우
            return ResponseEntity.badRequest().body("Invalid user ID or chat room ID");
        } catch (RuntimeException e) {
            // 사용자 정보 또는 채팅방 정보를 찾을 수 없는 경우
            return ResponseEntity.notFound().build();
        }
    }


//    @PostMapping("/api/chat/sendMessage")
//    public ResponseEntity<?> saveMessage(@Payload ChatDTO chatDTO) {
//        User user = userRepository.findById(Integer.valueOf(chatDTO.getUser())).orElseThrow(() -> new RuntimeException("User not found"));
//        ChatRoom chatRoom = chatRoomRepository.findById(chatDTO.getChatRoom().getId()).orElseThrow(() -> new RuntimeException("Chat room not found"));
//
//        System.out.println("유저:" + user);
//        // 메시지 저장 로직
//        Chat chat = chatService.saveMessage(chatDTO.getMessage(), user, chatRoom);
//        ChatDTO chatDTO1 = ChatDTO.toDto(chat);
//
//        return ResponseEntity.ok(chatDTO1);
//    }

//    @MessageMapping("/chat/sendMessage")
//    public ResponseEntity<?> saveMessage(@Payload ChatDTO chatDTO) {
//        // 클라이언트가 보낸 채팅 정보를 DTO에서 엔티티로 변환하여 저장
//        ChatRoom chatRoom = chatRoomRepository.findById(chatDTO.getChatRoom().getId())
//                .orElseThrow(() -> new RuntimeException("Chat room not found"));
//
//        // 채팅 메시지를 서비스를 통해 DB에 저장
//        Chat savedChat = chatService.saveMessage(chatDTO.getMessage(), chatDTO.getChatRoom().getUser(), chatRoom);
//
//        // 저장된 채팅 메시지를 클라이언트로 반환
//        ChatDTO savedChatDTO = new ChatDTO();
//        savedChatDTO.setId(savedChat.getId());
//        savedChatDTO.setMessage(savedChat.getMessage());
//        savedChatDTO.setUser(savedChat.getUser());
//        savedChatDTO.setChatRoom(ChatRoomDTO.toDto(chatRoom));
//
//        return ResponseEntity.ok(savedChatDTO);
//    }

}
