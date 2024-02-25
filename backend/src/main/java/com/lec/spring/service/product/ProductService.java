package com.lec.spring.service.product;

import com.lec.spring.domain.Category;
import com.lec.spring.domain.Product;
import com.lec.spring.domain.ProductImage;
import com.lec.spring.domain.User;
import com.lec.spring.dto.ProductDTO;
import com.lec.spring.repository.CategoryRepository;
import com.lec.spring.repository.product.ProductImageRepository;
import com.lec.spring.repository.product.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    @Value("${app.upload.product.path}")
    private String uploadDir;

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final CategoryRepository categoryRepository;

    // 등록
    @Transactional
    public ProductDTO write(Product product, String category){
        System.out.println(category);
        Category category1 = categoryRepository.findById(Integer.parseInt(category)).orElse(null);
        product.setCategory(category1);
        return ProductDTO.toDto(productRepository.saveAndFlush(product));
    }

    // 목록
    @Transactional
    public List<Product> list(){
        return productRepository.findAll();
    }

    // 상세
    @Transactional
    public Product detail(Long id){
        Product product = productRepository.findById(id).orElse(null);
        List<ProductImage> fileList = productImageRepository.findByProduct(product);
        product.setFileList(fileList);
        return product;
    }

    // 수정
    @Transactional
    public ProductDTO update(Product product) {
        Product productEntity = productRepository.findById(product.getId()).orElse(null);
        // Product 업데이트
        productEntity.setTitle(product.getTitle());
        productEntity.setPrice(product.getPrice());
        productEntity.setStatus(product.getStatus());
        productEntity.setDescription(product.getDescription());
        productEntity.setMiddleCategory(product.getMiddleCategory());

        productEntity.setRefreshedAt(product.getRefreshedAt());  // 끌어올리기
//        System.out.println("productEntity.setRefreshedAt(); = " + productEntity.setRefreshedAt(product.getRefreshedAt()));
//        productEntity.setLocation(product.getLocation());   // 위치

        productRepository.save(productEntity);

        return ProductDTO.toDto(productEntity);
    }

    // 삭제
    @Transactional
    public String delete(Long id){
        boolean isexists = productRepository.existsById(id);
        if (!isexists) return "FAIL";
        productRepository.deleteById(id);
        return "OK";
    }

    // - 지우가 씀 -
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElse(null);
    }
}