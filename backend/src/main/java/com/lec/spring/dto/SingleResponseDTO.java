package com.lec.spring.dto;

public class SingleResponseDTO<T> {
    private T data;
    // 필요에 따라 추가적인 응답 메타데이터 필드를 정의할 수 있습니다. 예: private String message;

    // 데이터를 초기화하는 생성자
    public SingleResponseDTO(T data) {
        this.data = data;
    }

    // 데이터에 접근하기 위한 getter 메서드
    public T getData() {
        return data;
    }

    // 데이터를 설정하기 위한 setter 메서드 (필요한 경우)
    public void setData(T data) {
        this.data = data;
    }

    // 필요에 따라 메시지 등의 추가적인 메타데이터에 접근하기 위한 getter/setter 메서드를 추가할 수 있습니다.
}

