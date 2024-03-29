package com.lec.spring.dto;

import com.lec.spring.domain.Chat;
import com.lec.spring.domain.ChatRoom;
import com.lec.spring.domain.Product;
import com.lec.spring.domain.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomDTO {


    private Integer id;
    private String seller;
    private String buyer;
    private ProductDTO productDTO;
    private List<ChatDTO> chats;

    public static ChatRoomDTO toDto(ChatRoom entity) {
        return ChatRoomDTO.builder()
                .id(entity.getId())
                .seller(entity.getSeller().getUsername())
                .buyer(entity.getBuyer().getUsername())
                .productDTO(ProductDTO.toDto(entity.getProduct()))
                .chats(ChatDTO.toDtoList(entity.getChats()))
                .build();
    }

    public static List<ChatRoomDTO> toDtoList(List<ChatRoom> chatRooms) {
        return chatRooms.stream()
                .map(ChatRoomDTO::toDto)
                .collect(Collectors.toList());
    }

    public static ChatRoomDTO create(ChatRoom entity) {
        return ChatRoomDTO.builder()
                .id(entity.getId())
                .seller(entity.getSeller().getUsername())
                .buyer(entity.getBuyer().getUsername())
                .productDTO(ProductDTO.toDto(entity.getProduct()))
                .build();
    }

}