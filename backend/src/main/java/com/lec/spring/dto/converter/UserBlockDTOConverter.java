package com.lec.spring.dto.converter;

import com.lec.spring.domain.ChatRoom;
import com.lec.spring.domain.UserBlock;
import com.lec.spring.dto.ChatRoomDTO;
import com.lec.spring.dto.UserBlockDTO;

public class UserBlockDTOConverter implements EntityDtoConverter<UserBlock, UserBlockDTO>{
    @Override
    public UserBlockDTO toDto(UserBlock entity) {
        return null;
    }
}