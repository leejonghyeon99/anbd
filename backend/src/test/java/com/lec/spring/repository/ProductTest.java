package com.lec.spring.repository;

import com.lec.spring.domain.Category;
import com.lec.spring.domain.Product;
import com.lec.spring.domain.Status;
import com.lec.spring.repository.product.ProductImageRepository;
import com.lec.spring.repository.product.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ProductTest {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Test
    public void test(){
        Category category1 = Category.builder()
                .id(1)

                .build();
        Status status1 = Status.SALE;
        Status status2 = Status.SOLD;
        Status status3 = Status.RESERVED;
        Product product = Product.builder()
                .id(1L)
                .title("테스트1")
                .category(category1)

                .price(15000)
                .description("테스트중")
                .status(status1)
                .build();

        productRepository.save(product);
        System.out.println();

    }

}
