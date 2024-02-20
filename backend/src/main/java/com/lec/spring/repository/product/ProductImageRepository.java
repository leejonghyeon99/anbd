package com.lec.spring.repository.product;

import com.lec.spring.domain.Product;
import com.lec.spring.domain.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
    List<ProductImage> findByProduct(Product product);
}
