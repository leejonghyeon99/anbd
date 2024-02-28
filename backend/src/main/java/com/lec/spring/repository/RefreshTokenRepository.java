package com.lec.spring.repository;

import com.lec.spring.domain.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {

    Optional<RefreshToken> findByUsername(String username);

    Optional<RefreshToken> findByValue(String value);

    void deleteByUsername(String username);
}
