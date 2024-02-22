package com.lec.spring.service.product;

import com.lec.spring.domain.Category;
import com.lec.spring.domain.Product;
import com.lec.spring.domain.ProductImage;
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
    public ProductDTO write(Product product){
        Product productEntity = productRepository.findById(product.getId()).orElse(null);
        String main = product.getCategory().getMain();
        String sub = product.getCategory().getSub();
        if (!(categoryRepository.findByMain(main).isPresent() && categoryRepository.findBySub(sub).isPresent())){
            Category category = Category.builder()
                    .main(product.getCategory().getMain())
                    .sub(product.getCategory().getSub())
                    .build();

            productEntity.setCategory(category);
            productRepository.save(productEntity);

            return ProductDTO.toDto(productEntity);
        }

        return null;
    }

    // 목록
    @Transactional
    public List<ProductDTO> list(String category, String search) {
        List<Product> productList;

//        if (search != null && !search.isEmpty()) {
//            // 검색어가 있을 경우, 검색어를 이용하여 필터링
//            productList = productRepository.findByTitleContainingIgnoreCase(search);
//        } else {
//            // 검색어가 없을 경우, 전체 상품 목록 반환
//            productList = productRepository.findAll();
//        }
//            List<Product> products = productRepository.findByTitleContainingIgnoreCaseAndCategory_TitleContainingIgnoreCase(category, search);
//        return productList.stream()
//                .map(product -> ProductDTO.toDto(product))
//                .collect(Collectors.toList());
            return null;

    }

    // 상세
    @Transactional
    public ProductDTO detail(Long id){
        Product product = productRepository.findById(id).orElse(null);
        User user = userRepository.findById(2).orElse(null);
//        product.getUser().getId()
        product.setUser(user);

//        List<ProductImage> fileList = productImageRepository.findByProduct(product);
//        product.setFileList(fileList);
        return ProductDTO.toDto(product);
    }

    // 수정
    @Transactional
    public ProductDTO update(ProductDTO product) {
        System.out.println(product.toString());
        Product productEntity = productRepository.findById(product.getId()).orElse(null);
        Category category = categoryRepository.findById(product.getCategory().getId()).orElse(null);

        if (category != null) {
            category.setName(product.getCategory().getName());
            categoryRepository.save(category);

            productEntity.setLocation(product.getLocation());   // 위치
            productEntity.setTitle(product.getTitle());
            productEntity.setPrice(product.getPrice());
            productEntity.setStatus(product.getStatus());
            productEntity.setDescription(product.getDescription());
            productEntity.setMiddleCategory(product.getMiddleCategory());
            productEntity.setCategory(category);
            productEntity.setRefreshedAt(product.getRefreshedAt());  // 끌어올리기
            productRepository.save(productEntity);
        }


//        Category category1 = categoryRepository.findById(Integer.parseInt(category)).orElseThrow(() -> new IllegalArgumentException("카테고리가 존재하지 않습니다: " + category));
//        System.out.println(product.getCategory());
        // Product 업데이트
//        productEntity.setLocation(product.getLocation());   // 위치
//        productEntity.setTitle(product.getTitle());
//        productEntity.setPrice(product.getPrice());
//        productEntity.setStatus(product.getStatus());
//        productEntity.setDescription(product.getDescription());
//        productEntity.setMiddleCategory(product.getMiddleCategory());
//        productEntity.setCategory(product.getCategory());
//        System.out.println("+++++++" + product.getCategory());
//        productEntity.setCategory(category1);

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

    // 카테고리
    public List<CategoryDTO> findByCategory (){

        return CategoryDTO.toDtoList(categoryRepository.findAll());

    }
}