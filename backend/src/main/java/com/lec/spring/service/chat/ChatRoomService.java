package com.lec.spring.service.chat;

import com.lec.spring.domain.Chat;
import com.lec.spring.domain.ChatRoom;
import com.lec.spring.domain.Product;
import com.lec.spring.domain.User;
import com.lec.spring.dto.ChatRoomDTO;
import com.lec.spring.repository.ChatRepository;
import com.lec.spring.repository.ChatRoomRepository;
import com.lec.spring.repository.UserRepository;
import com.lec.spring.repository.product.ProductRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ChatRepository chatRepository;

//    @Transactional
    public ChatRoom createRoom (Integer sellerId, Integer buyerId, Long productId) {
        User seller = userRepository.findById(sellerId).orElse(null);
        User buyer = userRepository.findById(buyerId).orElse(null);
        Product product = productRepository.findById(productId).orElse(null);

        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setSeller(seller);
        chatRoom.setBuyer(buyer);
        chatRoom.setProduct(product);
        return chatRoomRepository.saveAndFlush(chatRoom);
//        Integer chatRoomId = chatRoom1.getId();
    }

    public ChatRoom findRoomBySellerAndBuyer(Integer sellerId, Integer buyerId, Long productId) {
        return chatRoomRepository.getChatExist(sellerId, buyerId, productId);
    }

    public List<Chat> getChatHistory(ChatRoom chatRoom) {
        return chatRepository.findByChatRoom(chatRoom);
    }
}
