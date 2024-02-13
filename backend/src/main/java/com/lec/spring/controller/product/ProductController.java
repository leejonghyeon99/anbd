package com.lec.spring.controller.product;

import com.lec.spring.domain.Product;
import com.lec.spring.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;

    // 등록
    @PostMapping("/write")
    public ResponseEntity<?> write(@RequestBody Map<String,Object> product){
        System.out.println(product);
//        Product product1 = productService.write(product);
        return new ResponseEntity<>(null, HttpStatus.CREATED);  //201
    }
    // 목록
    @GetMapping("/list")
    public ResponseEntity<?> list(){
        return new ResponseEntity<>(productService.list(), HttpStatus.OK);
    }
    // 상세
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable Long id){
        return new ResponseEntity<>(productService.detail(id), HttpStatus.OK);
    }

    // 수정
    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody Product product){
        return new ResponseEntity<>(productService.update(product), HttpStatus.OK);
    }

    // 삭제
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        return new ResponseEntity<>(productService.delete(id), HttpStatus.OK);
    }
}