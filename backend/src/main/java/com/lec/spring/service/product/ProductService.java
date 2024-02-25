package com.lec.spring.service.product;

import com.lec.spring.domain.Category;
import com.lec.spring.domain.Product;
import com.lec.spring.domain.ProductImage;
import com.lec.spring.domain.User;
import com.lec.spring.dto.CategoryDTO;
import com.lec.spring.dto.ProductDTO;
import com.lec.spring.repository.CategoryRepository;
import com.lec.spring.repository.UserRepository;
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
    private final UserRepository userRepository;

    // 등록
    @Transactional
    public ProductDTO write(Product product){
        System.out.println(product);
        String main = product.getCategory().getMain();
        String sub = product.getCategory().getSub();

        User user = userRepository.findById(1).orElse(null);

        Category category = categoryRepository.findUnique(main, sub);
        System.out.println(user.toString());
        product.setCategory(category);
        product.setUser(user);
        productRepository.saveAndFlush(product);
        User writer = userRepository.findById(product.getUser().getId()).orElse(null);

        product.setUser(writer);

        return ProductDTO.toDto(product);
    }

    // 목록
    @Transactional
    public List<ProductDTO> list(String sub, String search) {
        Category category = categoryRepository.findBySub(sub).orElse(null);
        List<ProductDTO> list = ProductDTO.toDtoList(productRepository.getProductBySub(category.getId()));
        return list;

    }
    // 상세
    @Transactional
    public ProductDTO detail(Long id){
        Product product = productRepository.findById(id).orElse(null);
        User user = userRepository.findById(product.getUser().getId()).orElse(null);
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
//        Category category = categoryRepository.findById(product.getCategory().getId()).orElse(null);

        String main = product.getCategory().getMain();
        String sub = product.getCategory().getSub();
        Category category = categoryRepository.findUnique(main, sub);

        if (category != null) {
            category.setMain(product.getCategory().getMain());
            category.setSub(product.getCategory().getSub());

            categoryRepository.save(category);

            productEntity.setLocation(product.getLocation());   // 위치
            productEntity.setTitle(product.getTitle());
            productEntity.setPrice(product.getPrice());
            productEntity.setStatus(product.getStatus());
            productEntity.setDescription(product.getDescription());
            productEntity.setCategory(category);
            productEntity.setRefreshedAt(product.getRefreshedAt());  // 끌어올리기
            productRepository.save(productEntity);
        }
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

    // 특정 main으로 sub 가져오기 카테고리
    public List<CategoryDTO> findByMainForSub (String main){
        System.out.println("main : ========================" + main);
        return CategoryDTO.toDtoList(categoryRepository.findAllGroupMain(main).orElse(null));
    }
    // main만 가져오기 카테고리
    public List<CategoryDTO> findByMainForList (){
        return CategoryDTO.toDtoList( categoryRepository.findAllOnlyMain().orElse(null));
    }
    // sub만 가져오기 카테고리
    public List<CategoryDTO> findBySubForList (){
        System.out.println("---------------------------------------------");
        System.out.println(categoryRepository.findAllOnlySub().orElse(null));
        return CategoryDTO.toDtoList( categoryRepository.findAllOnlySub().orElse(null));
    }

    // - 지우가 씀 -
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElse(null);
    }
}