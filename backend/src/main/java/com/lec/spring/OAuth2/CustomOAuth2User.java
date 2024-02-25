package com.lec.spring.OAuth2;

import com.lec.spring.domain.Auth;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import java.util.Collection;
import java.util.Map;


public class CustomOAuth2User extends DefaultOAuth2User {

    private String email;
    private Auth auth;

    /**
     * Constructs a {@code DefaultOAuth2User} using the provided parameters.
     *
     * @param authorities      the authorities granted to the user
     * @param attributes       the attributes about the user
     * @param provider_id the key used to access the user's &quot;name&quot; from
     *                         {@link #getAttributes()}
     */
    public CustomOAuth2User(Collection<? extends GrantedAuthority> authorities, Map<String, Object> attributes, String provider_id,
                            String email, Auth auth) {
        super(authorities, attributes, provider_id);
        this.email = email;
        this.auth = auth;
    }

}
