package com.lec.spring.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

// 프론트, 백 서로 다른 서버 사용 시 설정
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter(){
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.addAllowedOriginPattern("*");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.addAllowedMethod("*");

        // 이 요청주소로 오는 모든 출처, 헤더, 요청방식 허용
        source.registerCorsConfiguration("/api/**", corsConfiguration);


        return new CorsFilter(source);
    }
}
