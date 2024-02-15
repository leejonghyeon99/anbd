package com.lec.spring.jwt;

import com.lec.spring.service.CustomUserDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// 직접 만든 TokenProvider 와 JwtFilter 를 SecurityConfig 에 적용할 때 사용
@RequiredArgsConstructor
public class JwtSecurityConfig extends SecurityConfigurerAdapter<DefaultSecurityFilterChain, HttpSecurity> {

    private final TokenProvider tokenProvider;


    @Override
    public void configure(HttpSecurity httpSecurity){
        JwtFilter costomFilter = new JwtFilter(tokenProvider);
        httpSecurity.addFilterBefore(costomFilter, UsernamePasswordAuthenticationFilter.class);
    }

}
