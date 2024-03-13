package com.lec.spring.dto;

import com.lec.spring.domain.Category;
import com.lec.spring.domain.Chat;
import com.lec.spring.domain.ChatRoom;
import com.lec.spring.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatDTO {

    private Integer id;
    private String message;
    private UserDTO sender;
    private ChatRoomDTO chatRoom;

    public static ChatDTO toDto(Chat entity) {
        return ChatDTO.builder()
                .id(entity.getId())
                .sender(UserDTO.toDto(entity.getSender()))
                .message(entity.getMessage())
                .chatRoom(ChatRoomDTO.toDto(entity.getChatRoom()))
                .build();
    }

    public static List<ChatDTO> toDtoList(List<Chat> chats) {
        return chats.stream()
                .map(ChatDTO::toDto)
                .collect(Collectors.toList());
    }
}
