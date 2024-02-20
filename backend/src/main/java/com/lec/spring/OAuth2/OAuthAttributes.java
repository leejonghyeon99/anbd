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

    private String nameAttributeKey; // 사용자 정보에서 고유 사용자 ID 값을 참조하는 데 사용되는 키(필드)의 이름입니다.
    private OAuth2UserInfo oAuth2UserInfo;

    public static OAuthAttributes of(String provider,
                                     String nameAttributeKey, Map<String, Object> attributes) {

        if (provider.equals("Naver")) {
            return ofNaver(nameAttributeKey, attributes);
        }
        if (provider.equals("Kakao")) {
            return ofKakao(nameAttributeKey, attributes);
        }
        return ofGoogle(nameAttributeKey, attributes);
    }

    private static OAuthAttributes ofNaver(String nameAttributeKey, Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .nameAttributeKey(nameAttributeKey)
                .oAuth2UserInfo(new NaverOAuth2UserInfo(attributes))
                .build();
    }

    private static OAuthAttributes ofKakao(String nameAttributeKey, Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .nameAttributeKey(nameAttributeKey)
                .oAuth2UserInfo(new KakaoOAuth2UserInfo(attributes))
                .build();
    }

    private static OAuthAttributes ofGoogle(String nameAttributeKey, Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .nameAttributeKey(nameAttributeKey)
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
