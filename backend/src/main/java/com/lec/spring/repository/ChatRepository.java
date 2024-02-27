package com.lec.spring.repository;

import com.lec.spring.domain.Chat;
import com.lec.spring.domain.ChatRoom;
import com.lec.spring.dto.ChatDTO;
import com.lec.spring.dto.ChatRoomDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Integer> {
    List<Chat> findByChatRoom(ChatRoom chatRoom);

    String findByMessage(String message);

//    List<ChatDTO> findAllByChatRoom(ChatRoomDTO chatRoomDTO);

//    List<ChatDTO> findAllByMessage(String message);
}
