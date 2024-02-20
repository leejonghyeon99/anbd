package com.lec.spring.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;

    public void setValues(String key, Object value, Duration expiration) {
        ValueOperations<String, Object> valueOperations = redisTemplate.opsForValue();
        valueOperations.set(key, value, expiration);
    }

    public Object getValues(String key) {
        ValueOperations<String, Object> valueOperations = redisTemplate.opsForValue();
        return valueOperations.get(key);
    }

    public void deleteValues(String key) {
        redisTemplate.delete(key);
    }

    public boolean checkExistsValue(String key) {
        System.out.println("key: " + key);
        return redisTemplate.hasKey(key);
    }
}