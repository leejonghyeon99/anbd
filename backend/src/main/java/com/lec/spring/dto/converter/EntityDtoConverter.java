package com.lec.spring.dto.converter;

public interface EntityDtoConverter<T, D> {
    D toDto(T entity);
}
