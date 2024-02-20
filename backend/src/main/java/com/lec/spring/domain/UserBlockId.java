package com.lec.spring.domain;

import jakarta.persistence.Column;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@NoArgsConstructor
public class UserBlockId implements Serializable {

    private User userId;
    private User targetId;
}
