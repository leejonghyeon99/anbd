package com.lec.spring.repository;

import com.lec.spring.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Integer> {


    Optional<User> findByUsername(String username);

    // 회원가입 시 아이디 존재여부 확인
    boolean existsByUsername(String username);
}
