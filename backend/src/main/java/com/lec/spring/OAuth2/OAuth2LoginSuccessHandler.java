package com.lec.spring.OAuth2;

import com.lec.spring.domain.Auth;
import com.lec.spring.domain.User;
import com.lec.spring.jwt.TokenProvider;
import com.lec.spring.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.BeanDefinitionDsl;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final TokenProvider tokenProvider;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("OAuth2 Login 성공!");
        CustomOAuth2User cuntomOAuth2User = (CustomOAuth2User) authentication.getPrincipal();
//
//        if (cuntomOAuth2User.getAuthorities() == Role.GUEST){
//
//        }

    }
}
