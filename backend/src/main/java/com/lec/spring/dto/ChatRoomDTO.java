package com.lec.spring.dto;

import com.lec.spring.domain.Product;
import com.lec.spring.domain.User;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomDTO {


    private Integer id;
    private boolean confirm;
    private User user;
    private Product product;

}