package com.lec.spring.dto;

import com.lec.spring.domain.ChatRoom;
import com.lec.spring.domain.Product;
import com.lec.spring.domain.User;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomDTO {


    private Integer id;
    private User user;
    private Product product;

    public static ChatRoomDTO toDto(ChatRoom entity) {
        return ChatRoomDTO.builder()
                .id(entity.getId())
                .product(entity.getProduct())
                .build();
    }

    public static List<ChatRoomDTO> toDtoList(List<ChatRoom> chatRooms) {
        return chatRooms.stream()
                .map(ChatRoomDTO::toDto)
                .collect(Collectors.toList());
    }

}