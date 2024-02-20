package com.lec.spring.service.product;

import com.lec.spring.domain.ProductImage;
import com.lec.spring.repository.product.ProductImageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductImageService {
    private ProductImageRepository productImageRepository;

    // 이미지 첨부파일
    @Transactional
    public ProductImage findByImageId(Integer id){
        return productImageRepository.findById(id).orElse(null);
    }
}