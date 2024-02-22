package com.lec.spring.repository;

import com.lec.spring.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    Optional<Category> findByMain(String main);
    Optional<Category> findBySub(String sub);

}
