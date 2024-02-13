package com.lec.spring.config;

public class EmailVerificationResult {
    private final boolean success;

    // 생성자를 private으로 선언하여 외부에서 직접 인스턴스화하지 못하도록 함
    private EmailVerificationResult(boolean success) {
        this.success = success;
    }

    // 인증 결과에 따라 EmailVerificationResult 인스턴스를 생성하는 정적 팩토리 메서드
    public static EmailVerificationResult of(boolean authResult) {
        return new EmailVerificationResult(authResult);
    }

    // 인증 성공 여부를 반환하는 메서드
    public boolean isSuccess() {
        return success;
    }

    // 인증 결과에 따라 사용자에게 보여줄 메시지나 추가 로직을 처리할 수 있는 메서드를 추가할 수 있음
    // 예: getMessage(), getResponseCode() 등
}

