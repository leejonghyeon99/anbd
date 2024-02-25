package com.lec.spring.service.product;

import com.lec.spring.dto.CategoryDTO;
import com.lec.spring.repository.CategoryRepository;
import com.lec.spring.repository.product.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ProductServiceTest {

    @Autowired
    private CategoryRepository repository;

    @Test
    void testt1(){
        System.out.println(repository.findAllOnlyMain());
    }

    @Test
    void testt2(){
        System.out.println(repository.findAllOnlySub());
    }
    @Test
    void testt3(){
        System.out.println(repository.findAllGroupMain("의류"));
    }


    @Test
    void findByMainForList() {

        System.out.println(repository.findAllOnlyMain()
        );
    }
}