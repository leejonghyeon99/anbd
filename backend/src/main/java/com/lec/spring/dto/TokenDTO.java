package com.lec.spring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenDTO {

    private String grantType;
    private String accessToken;
    private long accessTokenExpireTime;
    private String refreshToken;





}
