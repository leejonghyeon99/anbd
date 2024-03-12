package com.lec.spring.config;


import com.lec.spring.jwt.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final TokenProvider tokenProvider;
    private final CorsFilter corsFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtFilter jwtFilter() {
        JwtFilter jwtFilter = new JwtFilter(tokenProvider);
        return jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // csrf, cors 설정
        http.csrf((csrf) -> csrf.disable());
        http.addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class);

        // 폼로그인, 베이직http 비활성화
        http.formLogin((form) -> form.disable());
        http.httpBasic(AbstractHttpConfigurer::disable);

        // 세션 생성 or 사용 x
        http.sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // jwt 설정
        http.apply(new JwtSecurityConfig(tokenProvider));
        http.exceptionHandling((exceptionHandling) -> exceptionHandling
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .accessDeniedHandler(jwtAccessDeniedHandler));

        // 권한 규칙 작성
        http.authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers("/api/admin/**", "/api/analyze/**").hasAuthority("ROLE_ADMIN") // 관리자 권한이 필요한 API
                        .requestMatchers("/api/user/passwordCheck","/api/user/update","/api/user/updatePassword"
                            ,"/api/user/info", "/api/user/logout", "/api/user/deleteUser"
                            ,"/api/product/write","/api/product/update", "/api/chat/**", "/api/like").hasAnyAuthority("ROLE_USER","ROLE_ADMIN")
                        .requestMatchers("/api/user/signup", "/api/user/login","/api/auth/reissue", "/api/email/**"
                            , "/api/product/list/**","/api/product/detail/**","/product/download/**","/product/image/**", "/upload/**", "/api/product/category/**").permitAll()
                        .anyRequest().authenticated()
        );



//        http.oauth2Login(oauth2Login -> oauth2Login
//                .successHandler(oAuth2LoginSuccessHandler) // 동의하고 계속하기를 눌렀을 때 Handler 설정
//                .failureHandler(oAuth2LoginFailureHandler) // 소셜 로그인 실패 시 핸들러 설정
//                .userInfoEndpoint(userInfoEndpoint -> userInfoEndpoint
//                        .userService(customOAuth2UserService)
//                )
//        );

        return http.build();

    }
}