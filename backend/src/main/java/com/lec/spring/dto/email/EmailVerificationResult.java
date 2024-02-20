package com.lec.spring.dto.email;


import lombok.Getter;

@Getter
public class EmailVerificationResult {

    private final boolean verified;

    private EmailVerificationResult(boolean verified) {
        this.verified = verified;
    }

    public static EmailVerificationResult of(boolean verified) {
        return new EmailVerificationResult(verified);
    }
}