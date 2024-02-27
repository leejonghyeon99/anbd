package com.lec.spring.repository.product;

import com.lec.spring.domain.Product;
import com.lec.spring.domain.Status;
import com.lec.spring.dto.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("select p from Product p where p.category.id = :categoryId")
    List<Product> getProductBySub(Integer categoryId);

    Page<Product> findByUserIdAndStatus(Pageable pageable, Integer user_id, Status status);

    Page<Product> findByUserId(Pageable pageable, Integer user_id);
}
