package com.lec.spring.domain;

import lombok.Data;
import lombok.Getter;


@Getter
public enum Status {
    SALE("SALE"),
    RESERVED("RESERVED"),
    SOLD("SOLD");

    private final String status;

    Status(String status) {
        this.status = status;
    }
}