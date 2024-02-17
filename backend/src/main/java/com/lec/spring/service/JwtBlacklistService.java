package com.lec.spring.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class JwtBlacklistService {

    private final StringRedisTemplate redisTemplate;

    public void blacklistToken(String accessToken){
        redisTemplate.opsForValue().set("BL_"+accessToken, "blacklisted", 1, TimeUnit.DAYS);
    }

    public boolean isTokenBlacklisted(String accessToken){
        return redisTemplate.hasKey("BL_" + accessToken);
    }
}
