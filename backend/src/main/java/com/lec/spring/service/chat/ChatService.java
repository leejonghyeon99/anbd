package com.lec.spring.service.chat;

import com.lec.spring.domain.Chat;
import com.lec.spring.domain.ChatRoom;
import com.lec.spring.domain.Product;
import com.lec.spring.domain.User;
import com.lec.spring.dto.ChatDTO;
import com.lec.spring.dto.ChatRoomDTO;
import com.lec.spring.repository.ChatRepository;
import com.lec.spring.repository.ChatRoomRepository;
import com.lec.spring.repository.UserRepository;
import com.lec.spring.repository.product.ProductRepository;
import com.lec.spring.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public ChatDTO createChat(String message, int roomId, String username){
        ChatRoom room = chatRoomRepository.findById(roomId).orElse(null);
        if(room == null){
            return null;
        }

        User sender = userRepository.findByUsername(username).orElse(null);
        Chat chat = Chat.builder()
                .chatRoom(room)
                .sender(sender)
                .message(message)
                .build();
        chatRepository.save(chat);



        return ChatDTO.toDto(chat);
    }

    @Transactional
    public ChatRoomDTO createRoom(String username, Long productId){
        User buyer = userService.getUser().get();
        User seller = userRepository.findByUsername(username).orElse(null);
        Product product = productRepository.findById(productId).orElse(null);

        ChatRoom room = chatRoomRepository.findByBuyerIdAndSellerIdAndProductId(buyer.getId(), seller.getId(), productId).orElse(null);

        if(room != null){
            return ChatRoomDTO.toDto(room);
        }
        room = ChatRoom.builder()
                .buyer(buyer)
                .seller(seller)
                .product(product)
                .build();

        chatRoomRepository.save(room);
        return ChatRoomDTO.toDto(room);
    }
}
