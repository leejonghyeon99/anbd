package com.lec.spring.dto.converter;

import com.lec.spring.domain.Product;
import com.lec.spring.domain.WishList;
import com.lec.spring.dto.ProductDTO;
import com.lec.spring.dto.WishListDTO;

public class WishListDTOConverter  implements EntityDtoConverter<WishList, WishListDTO>{
    @Override
    public WishListDTO toDto(WishList entity) {
        return null;
    }
}
