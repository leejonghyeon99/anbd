package com.lec.spring.repository;

import com.lec.spring.domain.Auth;
import com.lec.spring.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface UserRepository extends JpaRepository<User, Integer> {
}
