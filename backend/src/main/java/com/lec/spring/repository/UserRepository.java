package com.lec.spring.repository;

import com.lec.spring.domain.User;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Integer> {


    Optional<User> findByUsername(String username);

    // 회원가입 시 메일 존재여부 확인
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.provider = :provider AND u.provider_id = :provider_id")
    Optional<User> findByProviderAndProvider_id(@Param("provider") String provider, @Param("provider_id") String provider_id);

    Optional<User> findOneWithAuthoritiesByUsername(String username);


    Page<User> findByUsernameContainingIgnoreCase(String search, Pageable pageable);

    Optional<User> findByNickname(String nickname);
}
