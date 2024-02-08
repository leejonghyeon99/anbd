package com.lec.spring.dto;

import com.lec.spring.domain.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {

    private Long id;
    private String title;
    private String description;
    private int price;
    private Status status;
    private String location;
    private String middleCategory;
    private LocalDateTime refreshedAt;
    private CategoryDTO category;
    private UserDTO user;
    private List<WishListDTO> wishList;
    private List<ReviewDTO> reviews;
    private List<ChatRoomDTO> chatRooms;
}
