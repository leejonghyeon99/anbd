package com.lec.spring.repository.product;

import com.lec.spring.domain.Product;
import com.lec.spring.domain.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
//    List<ProductImage> findByProduct(Long id);

    // 특정 첨부파일(id) 한개 SELECT
//    Optional<ProductImage> findById(Integer id);

    List<ProductImage> findByProductId(Long productId);
}
