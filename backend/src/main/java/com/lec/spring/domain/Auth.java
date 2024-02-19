package com.lec.spring.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

public enum Auth {

    ROLE_USER("ROLE_USER"),
    ROLE_ADMIN("ROLE_ADMIN"),
    ROLE_BLOCK("ROLE_BLOCK");

    private final String auth;
//    private final String key;

    Auth(String auth) {
        this.auth = auth;
    }

//    public String getKey() {
//        return key;
//    }
}
