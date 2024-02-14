package com.lec.spring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RedisService {

    private final StringRedisTemplate stringRedisTemplate;

    @Autowired
    public RedisService(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    // Redis에 값을 저장하는 메서드
    public void setValue(String key, String value, Duration expiration) {
        ValueOperations<String, String> valueOps = stringRedisTemplate.opsForValue();
        valueOps.set(key, value, expiration);
    }

    // Redis에서 값을 가져오는 메서드
    public String getValues(String key) {
        ValueOperations<String, String> valueOps = stringRedisTemplate.opsForValue();
        return valueOps.get(key);
    }

    // Redis에서 키의 존재 여부를 확인하는 메서드
    public boolean checkExistValue(String key) {
        return stringRedisTemplate.hasKey(key);
    }
}
