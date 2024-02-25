package com.lec.spring.controller.product;

import com.lec.spring.domain.Product;
import com.lec.spring.domain.Status;
import com.lec.spring.dto.CategoryDTO;
import com.lec.spring.dto.ProductDTO;
import com.lec.spring.service.product.ProductImageService;
import com.lec.spring.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    public ResponseEntity<?> write(@RequestBody Product product){
        return new ResponseEntity<>(productService.write(product), HttpStatus.CREATED);  //201
    }
    // 목록
    @GetMapping("/list/{sub}")
    public ResponseEntity<?> list(
            @PathVariable(name = "sub") String sub,
            @RequestParam(required = false) String search
    ){
        return new ResponseEntity<>(productService.list(sub,search), HttpStatus.OK);
    }
    // 상세
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable Long id){
        return new ResponseEntity<>(productService.detail(id), HttpStatus.OK);
    }

    // 수정
    // Map이 아니라 Product 타입을 사용하는 이유는 배열타입인 변수들 때문에
    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody ProductDTO pd){
//        System.out.println("--------------------"+product);
//        Product pd = new Product();
//        pd.setId(Long.valueOf(String.valueOf(product.get("id"))));
//        pd.setTitle((String) product.get("title"));
//        pd.setMiddleCategory((String) product.get("middleCategory"));
//        pd.setPrice(Integer.parseInt((String) product.get("price")));
//        pd.setDescription((String) product.get("description"));
//        pd.setStatus(Status.valueOf((String) product.get("status")));
//        pd.setLocation((String) product.get("location"));
//        pd.setRefreshedAt(LocalDateTime.parse(String.valueOf(product.get("refreshedAt"))));  // 끌어올리기
//        pd.setCategory((Category) product.get("category"));
//        System.out.println("수정 "+pd.toString());
//        new ResponseEntity<>(productService.update(product), HttpStatus.OK);
        return new ResponseEntity<>(productService.update(pd), HttpStatus.OK);
    }

    // 삭제
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        return new ResponseEntity<>(productService.delete(id), HttpStatus.OK);
    }

    // Main만 가져오기
    @GetMapping("/category/main")
    public ResponseEntity<?> findByMainForList() {
        System.out.println("실행중");

        return new ResponseEntity<>(productService.findByMainForList(), HttpStatus.OK);
    }

    // 특정 main으로 검색한 sub 카테고리 목록
    @GetMapping("/category/find")
    public ResponseEntity<?> findByMainForSub(@RequestParam("main") String main){
        System.out.println(main);
        return new ResponseEntity<>(productService.findByMainForSub(main), HttpStatus.OK);
    }
    @GetMapping("/category/sub")
    public ResponseEntity<?> findBySubForList(){
        return new ResponseEntity<>(productService.findBySubForList(), HttpStatus.OK);
    }

    @InitBinder
    public void initBinder(WebDataBinder binder){
        System.out.println("initBinder() 호출");
    }
}