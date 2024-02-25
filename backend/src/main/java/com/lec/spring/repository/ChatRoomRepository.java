package com.lec.spring.repository;

import com.lec.spring.domain.ChatRoom;
import com.lec.spring.dto.ChatRoomDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {
    ChatRoom findBySellerIdAndBuyerIdAndProductId(Integer sellerId, Integer buyerId, Long productId);
//    List<ChatRoomDTO> findAllByRoomId(Integer id);

    @Query("" +
            "select c from ChatRoom c " +
            "where c.seller.id = :sellerId and " +
            " c.buyer.id = :buyerId and" +
            " c.product.id = :productId"
    )
    ChatRoom getChatExist(Integer sellerId, Integer buyerId, Long productId);
}
