package com.lec.spring.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker   // WebSocket 메세지 브로커 활성화
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat")     // 서버의 엔드포인트 "/chat" 로 지정
                .setAllowedOrigins("http://localhost:8080")         // 모든 origin 허용
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/queue");    // "/topic" 주제를 감지하여 클라이언트에게 메시지 전달을 활성화
                                                                    // 메시지를 구독하는 요청 url => 즉 메시지 받을 때
        registry.setApplicationDestinationPrefixes("/app");         // "/pub" 프리픽스를 사용하여 메시지를 메시지 핸들러에 라우팅
                                                                    // 메시지를 발행하는 요청 url => 즉 메시지 보낼 때
    }
}
