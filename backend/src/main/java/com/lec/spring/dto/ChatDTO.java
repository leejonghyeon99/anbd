package com.lec.spring.dto;

import com.lec.spring.domain.ChatRoom;
import com.lec.spring.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatDTO {

    private Integer id;
    private String message;
    private User user;
    private ChatRoom chatRoom;
}
