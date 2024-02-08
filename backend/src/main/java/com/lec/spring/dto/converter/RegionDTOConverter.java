package com.lec.spring.dto.converter;

import com.lec.spring.domain.ChatRoom;
import com.lec.spring.domain.Region;
import com.lec.spring.dto.ChatRoomDTO;
import com.lec.spring.dto.RegionDTO;

public class RegionDTOConverter implements EntityDtoConverter<Region, RegionDTO>{
    @Override
    public RegionDTO toDto(Region entity) {
        return null;
    }
}
