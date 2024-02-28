package com.lec.spring.config;


import com.lec.spring.OAuth2.CustomOAuth2UserService;
import com.lec.spring.OAuth2.OAuth2LoginFailureHandler;
import com.lec.spring.OAuth2.OAuth2LoginSuccessHandler;
import com.lec.spring.jwt.*;
import com.lec.spring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientProvider;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientProviderBuilder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.endpoint.DefaultClientCredentialsTokenResponseClient;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizedClientManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final UserRepository userRepository;
    private final TokenProvider tokenProvider;
    private final CorsFilter corsFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final UserDetailsService userDetailsService;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final OAuth2LoginFailureHandler oAuth2LoginFailureHandler;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

//    @Bean
//    public AuthenticationManager authenticationManager() {
//        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
//        provider.setPasswordEncoder(passwordEncoder());
//        provider.setUserDetailsService(userDetailsService);
//        return new ProviderManager(provider);
//    }

//    @Bean
//    public LoginSuccessHandler loginSuccessHandler() {
//        return new LoginSuccessHandler(jwtService, userRepository);
//    }
//
//    /**
//     * 로그인 실패 시 호출되는 LoginFailureHandler 빈 등록
//     */
//    @Bean
//    public LoginFailureHandler loginFailureHandler() {
//        return new LoginFailureHandler();
//    }
//
////[PART 4]
//    /**
//     * CustomJsonUsernamePasswordAuthenticationFilter 빈 등록
//     * 커스텀 필터를 사용하기 위해 만든 커스텀 필터를 Bean으로 등록
//     * setAuthenticationManager(authenticationManager())로 위에서 등록한 AuthenticationManager(ProviderManager) 설정
//     * 로그인 성공 시 호출할 handler, 실패 시 호출할 handler로 위에서 등록한 handler 설정
//     */
//    @Bean
//    public CustomJsonUsernamePasswordAuthenticationFilter customJsonUsernamePasswordAuthenticationFilter() {
//        CustomJsonUsernamePasswordAuthenticationFilter customJsonUsernamePasswordLoginFilter
//                = new CustomJsonUsernamePasswordAuthenticationFilter(objectMapper);
//        customJsonUsernamePasswordLoginFilter.setAuthenticationManager(authenticationManager());
//        customJsonUsernamePasswordLoginFilter.setAuthenticationSuccessHandler(loginSuccessHandler());
//        customJsonUsernamePasswordLoginFilter.setAuthenticationFailureHandler(loginFailureHandler());
//        return customJsonUsernamePasswordLoginFilter;
//    }

    //[PART 5]
    @Bean
    public JwtFilter jwtFilter() {
        JwtFilter jwtFilter = new JwtFilter(tokenProvider);
        return jwtFilter;
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
        http.cors((cors) -> cors.disable());
//        http.addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class);

        // 폼로그인, 베이직http 비활성화
        http.formLogin((form)-> form.disable());
        http.httpBasic(AbstractHttpConfigurer::disable);

        // 세션 생성 or 사용 x
        http.sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS));


        http.exceptionHandling((exceptionHandling) -> exceptionHandling
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .accessDeniedHandler(jwtAccessDeniedHandler));

        // 권한 규칙 작성
        http.authorizeHttpRequests((authorize)-> authorize
//                        .requestMatchers("/api/admin/**").hasRole("ROLE_ADMIN") // 관리자 권한이 필요한 API
//                        .requestMatchers("/api/user/**").hasRole("ROLE_USER") // 일반 사용자 권한이 필요한 API
                .requestMatchers("/api/**","oauth2/naver/**","/oauth2/authorization/", "/login/oauth2/code/**", "/favicon.ico", "/upload/**").permitAll()
                .anyRequest().authenticated()
                );


        http.apply(new JwtSecurityConfig(tokenProvider));

        http.oauth2Login(oauth2Login -> oauth2Login
                        .successHandler(oAuth2LoginSuccessHandler) // 동의하고 계속하기를 눌렀을 때 Handler 설정
                        .failureHandler(oAuth2LoginFailureHandler) // 소셜 로그인 실패 시 핸들러 설정
                        .userInfoEndpoint(userInfoEndpoint -> userInfoEndpoint
                        .userService(customOAuth2UserService)
                        )
                );

        return http.build();

    }
}