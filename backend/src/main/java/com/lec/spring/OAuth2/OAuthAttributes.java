package com.lec.spring.OAuth2;

import com.lec.spring.domain.Auth;
import com.lec.spring.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OAuthAttributes {

    private String provider_id;
    private OAuth2UserInfo oAuth2UserInfo;

    public static OAuthAttributes of(String provider,
                                     String provider_id, Map<String, Object> attributes) {

        if (provider.equals("Naver")) {
            return ofNaver(provider_id, attributes);
        }
        if (provider.equals("Kakao")) {
            return ofKakao(provider_id, attributes);
        }
        return ofGoogle(provider_id, attributes);
    }

    private static OAuthAttributes ofNaver(String provider_id, Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .provider_id(provider_id)
                .oAuth2UserInfo(new NaverOAuth2UserInfo(attributes))
                .build();
    }

    private static OAuthAttributes ofKakao(String provider_id, Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .provider_id(provider_id)
                .oAuth2UserInfo(new KakaoOAuth2UserInfo(attributes))
                .build();
    }

    private static OAuthAttributes ofGoogle(String provider_id, Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .provider_id(provider_id)
                .oAuth2UserInfo(new GoogleOAuth2UserInfo(attributes))
                .build();
    }

    public User toEntity(String provider, OAuth2UserInfo oauth2UserInfo) {
        return User.builder()
                .provider(provider)
                .provider_id(oauth2UserInfo.getId())
                .email(UUID.randomUUID() + "@socialUser.com")
                .nickname(oauth2UserInfo.getNickname())
                .thumbnail(oauth2UserInfo.getImageUrl())
                .auth(Auth.ROLE_USER)
                .build();
    }

}
