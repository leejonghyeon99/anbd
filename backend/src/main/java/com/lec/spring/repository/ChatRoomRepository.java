package com.lec.spring.repository;

import com.lec.spring.domain.ChatRoom;
import com.lec.spring.dto.ChatRoomDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {
//    List<ChatRoomDTO> findAllByRoomId(Integer id);
}
