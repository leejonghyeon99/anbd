package com.lec.spring.controller.product;

import com.lec.spring.domain.Category;
import com.lec.spring.domain.Product;
import com.lec.spring.domain.Status;
import com.lec.spring.service.product.ProductImageService;
import com.lec.spring.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;
    private final ProductImageService productImageService;

    // 등록
    @PostMapping("/write")
    public ResponseEntity<?> write(@RequestBody Map<String,Object> product){
//        Product product1 = productService.write(product);
        System.out.println("ProductController.write");
        System.out.println("product = " + product.toString());
//        System.out.println("::"+product.toString());
        Product pd = new Product();
        pd.setTitle((String) product.get("title"));
        pd.setMiddleCategory((String) product.get("middleCategory"));
        pd.setPrice(Integer.parseInt((String) product.get("price")));
        pd.setDescription((String) product.get("description"));
        pd.setStatus(Status.valueOf((String) product.get("status")));
        pd.setLocation((String) product.get("location"));
//        System.out.println(files.toString());
        System.out.println(pd.toString());

        return new ResponseEntity<>(productService.write(pd, (String) product.get("category")), HttpStatus.CREATED);  //201
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
    // Map이 아니라 Product 타입을 사용하는 이유는 배열타입인 변수들 때문에
    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody Product product){
        return new ResponseEntity<>(productService.update(product), HttpStatus.OK);
    }

    // 삭제
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        return new ResponseEntity<>(productService.delete(id), HttpStatus.OK);
    }

    @GetMapping("/category")
    public ResponseEntity<?> category(){
        return new ResponseEntity<>(productService.findByCategory(), HttpStatus.OK);
    }

    @InitBinder
    public void initBinder(WebDataBinder binder){
        System.out.println("initBinder() 호출");
    }
}