package com.lec.spring.dto.converter;

import java.util.List;
import java.util.stream.Collectors;

public class DTOConverter {

    public static <T, D> List<D> toDtoList(List<T> entities, EntityDtoConverter<T, D> converter) {
        return entities.stream()
                .map(converter::toDto)
                .collect(Collectors.toList());
    }
}
