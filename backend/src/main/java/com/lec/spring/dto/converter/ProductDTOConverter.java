package com.lec.spring.dto.converter;

import com.lec.spring.domain.ChatRoom;
import com.lec.spring.domain.Product;
import com.lec.spring.dto.ChatRoomDTO;
import com.lec.spring.dto.ProductDTO;

public class ProductDTOConverter implements EntityDtoConverter<Product, ProductDTO>{
    @Override
    public ProductDTO toDto(Product entity) {
        return null;
    }
}
