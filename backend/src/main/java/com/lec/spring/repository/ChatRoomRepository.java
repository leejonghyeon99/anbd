package com.lec.spring.repository;

import com.lec.spring.domain.ChatRoom;
import com.lec.spring.dto.ChatRoomDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {

    Optional<ChatRoom> findByBuyerIdAndSellerIdAndProductId(Integer buyer_id, Integer seller_id, Long product_id);
    Optional<List<ChatRoom>> findBySellerId(Integer sellerId);
}
