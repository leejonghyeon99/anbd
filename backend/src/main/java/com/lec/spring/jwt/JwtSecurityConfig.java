package com.lec.spring.jwt;

import com.lec.spring.OAuth2.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// 직접 만든 TokenProvider 와 JwtFilter 를 SecurityConfig 에 적용할 때 사용
@Configuration
@RequiredArgsConstructor
public class JwtSecurityConfig extends SecurityConfigurerAdapter<DefaultSecurityFilterChain, HttpSecurity> {

    private final TokenProvider tokenProvider;
    private final CustomOAuth2UserService customOAuth2UserService;

    @Override
    public void configure(HttpSecurity httpSecurity){
        try {
            httpSecurity
                    .oauth2Login(oauth2Login -> oauth2Login
                    .userInfoEndpoint(userInfoEndpoint -> userInfoEndpoint
                    .userService(customOAuth2UserService)
                    )
                    );
        } catch (Exception e) {
            throw new RuntimeException("OAUTH2 로그인 오류",e);
        }

        JwtFilter customFilter = new JwtFilter(tokenProvider);
        httpSecurity.addFilterBefore(customFilter, UsernamePasswordAuthenticationFilter.class);
    }

}
