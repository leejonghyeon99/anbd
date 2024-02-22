package com.lec.spring.repository.product;

import com.lec.spring.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByTitleContainingIgnoreCase(String title);
//    List<Product> findByTitleContainingIgnoreCaseAndCategory_TitleContainingIgnoreCase(String title, String category);

}
