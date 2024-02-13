package com.lec.spring.repository.product;

import com.lec.spring.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProductRepository extends JpaRepository<Product, Long> {

}
