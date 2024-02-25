package com.lec.spring.repository.product;

import com.lec.spring.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("select p from Product p where p.category.id = :categoryId")
    List<Product> getProductBySub(Integer categoryId);

}
