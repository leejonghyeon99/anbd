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

    // Product 엔터티의 ID를 사용하여 이미지 조회
    List<ProductImage> findByProductId(Long productId);

}
