package com.lec.spring.domain;

public enum ExceptionCode {
    USER_EXISTS("이미 존재하는 회원입니다."),
    NO_SUCH_ALGORITHM("알고리즘이 존재하지 않습니다."),
    UNABLE_TO_SEND_EMAIL("이메일 전송에 실패했습니다."),
    INVALID_TOKEN("토큰이 유효하지 않습니다."),
    LOGGED_OUT_USER("로그아웃된 사용자입니다."),
    TOKEN_MISMATCH("토큰의 유저 정보가 일치하지 않습니다.");

    private final String message;

    ExceptionCode(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
