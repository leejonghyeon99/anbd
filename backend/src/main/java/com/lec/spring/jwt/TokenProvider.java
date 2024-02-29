package com.lec.spring.jwt;

import com.lec.spring.dto.TokenDTO;
import com.lec.spring.dto.UserResponseDTO;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;


// 유저 정보를 토큰으로 만들기 or 토큰에서 유저 정보 가져오기
@Slf4j
@Component
public class TokenProvider {

    private static final String AUTH_KEY = "auth";
    private static final String BEARER_TYPE = "Bearer"; // 일반적으로 OAuth 2.0 인증 과정에서 사용되는 토큰 타입
    private static final long ACCESS_TOKEN_EXPIRE_TIME = 60 * 1000 * 2;
    private static final long REFRESH_TOKEN_EXPIRE_TIME = 60 * 1000 * 60 * 24;

    private final Key key;


    // @Value 스프링프레임워크 사용, 롬북 x
    public TokenProvider(@Value("${jwt.secret}") String secretKey) {    // secretKey spring에 주입받기
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);    // 디코딩하여 byte타입으로 저장
        this.key = Keys.hmacShaKeyFor(keyBytes);
        //  HMAC-SHA 알고리즘을 위한 비밀키(Key 타입)를 생성. 이 비밀키는 JWT의 서명 생성 및 검증에 사용
    }

    public TokenDTO createTokenDto(Authentication authentication){
        System.out.println("createTokenDto"+authentication);

        // 권한 가져오기
        String authority = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        long now = (new Date()).getTime(); // 현재 시간을 밀리초 단위로 now 에 저장

        // accessToken 생성
        Date tokenExpireTime = new Date(now + ACCESS_TOKEN_EXPIRE_TIME);
        String accessToken = Jwts.builder()
                .setSubject(authentication.getName())   // payload "sub": "name"
                .claim(AUTH_KEY, authority) // payload "auth": "ROLE_USER"
                .setExpiration(tokenExpireTime)
                .signWith(key, SignatureAlgorithm.HS512)  // header "alg": "HS512"
                .compact(); // 위에서 지정한 모든 설정을 기반으로 JWT를 생성하고, 이를 문자열로 압축하여 반환

        // refreshToken 생성
        String refreshToken = Jwts.builder()
                .setExpiration(new Date(now + REFRESH_TOKEN_EXPIRE_TIME))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();

        return TokenDTO.builder()
                .grantType(BEARER_TYPE)
                .accessToken(accessToken)
                .accessTokenExpireTime(tokenExpireTime.getTime())
                .refreshToken(refreshToken)
                .build();
    }

    public Authentication getAuthentication(String accessToken){
        // 토큰 풀기
        Claims claims = parseClaims(accessToken);
        // claims 는 jwt 인터페이스로 토큰 발급자, 만료 시간, 주제 등과 같은 다양한 정보를 포함

        if (claims.get(AUTH_KEY) == null){
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        // 사용자의 권한 정보를 나타내는 문자열을 분리하여 스트림을 생성한 후,
        // map을 사용하여 각 권한 문자열을 SimpleGrantedAuthority 객체로 변환하고, 최종적으로 collect(Collectors.toList())를 통해 이 객체들을 리스트로 수집합니다.
        Collection<? extends GrantedAuthority> authorities =    // GrantedAuthority를 구현하는 어떤 클래스의 객체라도 될 수 있음을 의미
                Arrays.stream(claims.get(AUTH_KEY).toString().split(","))
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

        UserDetails principal = new User(claims.getSubject(), "", authorities);

        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }

    public boolean tokenValidation(String token){
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.info("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {
            log.info("만료된 JWT 토큰입니다.");
        } catch (UnsupportedJwtException e) {
            log.info("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {
            log.info("JWT 토큰이 잘못되었습니다.");
        }
        return false;
    }

    private Claims parseClaims(String accessToken) {
        try {
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(accessToken).getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    // 액세스 토큰으로부터 사용자 이름을 추출하는 메소드
    public String getUsernameFromToken(String token) {
        Claims claims = parseClaims(token);
        return claims.getSubject();
    }

}
