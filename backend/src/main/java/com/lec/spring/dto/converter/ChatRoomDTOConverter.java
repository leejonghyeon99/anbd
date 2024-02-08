package com.lec.spring.dto.converter;

import com.lec.spring.domain.ChatRoom;
import com.lec.spring.dto.ChatRoomDTO;

public class ChatRoomDTOConverter implements EntityDtoConverter<ChatRoom, ChatRoomDTO>{
    @Override
    public ChatRoomDTO toDto(ChatRoom entity) {
        return null;
    }
}
