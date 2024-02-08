package com.lec.spring.dto.converter;

import com.lec.spring.domain.User;
import com.lec.spring.dto.UserDTO;

public class UserDTOConverter implements EntityDtoConverter<User, UserDTO> {

    @Override
    public  UserDTO toDto(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .password(user.getPassword())
                .rePassword(user.getRePassword())
                .name(user.getName())
                .phone_number(user.getPhone_number())
                .nickname(user.getNickname())
                .provider(user.getProvider())
                .provider_id(user.getProvider_id())
                .email(user.getEmail())
                .star(user.getStar())
                .auth(user.getAuth())
                .certification(user.isCertification())
                .thumbnail(user.getThumbnail())
                .products(DTOConverter.toDtoList(user.getProducts(), new ProductDTOConverter()))
                .regions(DTOConverter.toDtoList(user.getRegions(), new RegionDTOConverter()))
                .wishList(DTOConverter.toDtoList(user.getWishList(), new WishListDTOConverter()))
                .reviews(DTOConverter.toDtoList(user.getReviews(), new ReviewDTOConverter()))
                .chatRooms(DTOConverter.toDtoList(user.getChatRooms(), new ChatRoomDTOConverter()))
                .build();
    }
}