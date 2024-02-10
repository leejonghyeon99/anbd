package com.lec.spring.repository;

import com.lec.spring.domain.Auth;
import com.lec.spring.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Integer> {


    Optional<User> findByEmail(String email);

    // 회원가입 시 이메일 존재여부 확인
    boolean existsByEmail(String email);
}
