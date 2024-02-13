package com.lec.spring.service.product;

import com.lec.spring.domain.Product;
import com.lec.spring.domain.ProductImage;
import com.lec.spring.repository.product.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // 등록
    @Transactional
    public Product write(Product product){
        return productRepository.save(product);
    }
    // 목록
    @Transactional
    public List<Product> list(){
        return productRepository.findAll();
    }
    // 상세
    @Transactional
    public Product detail(Long id){
        return productRepository.findById(id).orElse(null);
    }
    // 수정
    @Transactional
    public Product update(Product product){
        Product productEntity = productRepository.findById(product.getId()).orElse(null);
        if (productEntity != null) {
            productEntity.setTitle(product.getTitle()); // 제목
            productEntity.setDescription(product.getDescription()); // 내용
            productEntity.setPrice(product.getPrice()); // 가격
            productEntity.setStatus(product.getStatus());   // 상태
            productEntity.setRefreshedAt(product.getRefreshedAt()); // 끌올 날짜
            productRepository.save(productEntity);
        }
        return productEntity;
    }
    // 삭제
    @Transactional
    public String delete(Long id){
        boolean isexists = productRepository.existsById(id);
        if (!isexists) return "FAIL";
        productRepository.deleteById(id);
        return "OK";
    }
}

