package com.lec.spring.dto.converter;

import com.lec.spring.domain.ChatRoom;
import com.lec.spring.domain.Review;
import com.lec.spring.dto.ChatRoomDTO;
import com.lec.spring.dto.ReviewDTO;

public class ReviewDTOConverter implements EntityDtoConverter<Review, ReviewDTO>{
    @Override
    public ReviewDTO toDto(Review entity) {
        return null;
    }
}