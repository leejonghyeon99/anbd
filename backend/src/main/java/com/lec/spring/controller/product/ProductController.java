package com.lec.spring.controller.product;

import com.lec.spring.domain.Product;
import com.lec.spring.domain.Status;
import com.lec.spring.dto.CategoryDTO;
import com.lec.spring.dto.ProductDTO;
import com.lec.spring.dto.ProductsDTO;
import com.lec.spring.service.product.ProductImageService;
import com.lec.spring.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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


    // 등록
    @PostMapping( "/write")
    public ResponseEntity<?> write(@ModelAttribute ProductsDTO product ,
                                   @RequestParam(value="files", required=false) List<MultipartFile> files){
        System.out.println("ProductController.write = " + product);
        System.out.println("productImage = " + files );
        return new ResponseEntity<>(productService.write(product, files), HttpStatus.CREATED);  //201
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


    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody ProductDTO pd, MultipartFile files, Long[] delfile){
        return new ResponseEntity<>(productService.update(pd, files, delfile), HttpStatus.OK);
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