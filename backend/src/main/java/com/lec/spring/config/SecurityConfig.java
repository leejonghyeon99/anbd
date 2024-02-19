package com.lec.spring.config;


import com.lec.spring.OAuth2.CustomOAuth2UserService;
import com.lec.spring.jwt.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.CorsFilter;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final TokenProvider tokenProvider;
    private final CorsFilter corsFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final UserDetailsService userDetailsService;
    private final CustomOAuth2UserService customOAuth2UserService;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    // ↓ Security 를 동작시키지 않기.
//    @Bean
//    public WebSecurityCustomizer webSecurityCustomizer(){
//        return web -> web.ignoring().anyRequest();   // 어떠한 request 도 security 가 무시함
//    }

//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
//        return http
//                .csrf(csrf -> csrf.disable())
//                .authorizeHttpRequests(auth -> auth
//                        .anyRequest().permitAll()
//                )
//                .formLogin(form -> form
//                        .loginPage("/user/login")
//                        .loginProcessingUrl("/user/login")
//                        .defaultSuccessUrl("/")
//                )
//                .logout(httpSecurityLogoutConfigurer -> httpSecurityLogoutConfigurer
//                        .logoutUrl("/user/logout")
//                        .invalidateHttpSession(false)
//                )
//
//                .build();
//    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.csrf((csrf) -> csrf.disable());
        http.cors(Customizer.withDefaults());

        // 세션 생성 or 사용 x
        http.sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // 폼로그인, 베이직http 비활성화
        http.formLogin((form)-> form.disable());
        http.httpBasic(AbstractHttpConfigurer::disable);

        http.exceptionHandling((exceptionHandling) -> exceptionHandling
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .accessDeniedHandler(jwtAccessDeniedHandler));

        // 권한 규칙 작성
        http.authorizeHttpRequests((authorize)-> authorize
//                        .requestMatchers("/api/admin/**").hasRole("ROLE_ADMIN") // 관리자 권한이 필요한 API
//                        .requestMatchers("/api/user/**").hasRole("ROLE_USER") // 일반 사용자 권한이 필요한 API
                .requestMatchers("/api/**").permitAll()
                .anyRequest().authenticated()
                );


        http.apply(new JwtSecurityConfig(tokenProvider, customOAuth2UserService));

        return http.build();

    }
}