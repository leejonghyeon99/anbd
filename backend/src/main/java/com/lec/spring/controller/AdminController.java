package com.lec.spring.controller;

import com.lec.spring.domain.Category;
import com.lec.spring.domain.Report;
import com.lec.spring.dto.CategoryDTO;
import com.lec.spring.dto.ProductDTO;
import com.lec.spring.dto.ReportDTO;
import com.lec.spring.dto.UserDTO;
import com.lec.spring.service.admin.AdminService;
import com.lec.spring.service.admin.AnalyzeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {


    private final AdminService adminService;
    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }


    //특정 유저
    @GetMapping("/user/{id}")
    public ResponseEntity<UserDTO> findUser(
            @PathVariable("id") Integer id
    ){
        return new ResponseEntity<>(adminService.findUserById(id),HttpStatus.OK);
    }


    //유저 목록
    @GetMapping("/user/list")
    public ResponseEntity<Page<UserDTO>> userList(
            @RequestParam(defaultValue = "0") int page
    ){
        return new ResponseEntity<>(adminService.userList(page), HttpStatus.OK);
    }


    //신고 목록
    @GetMapping("/report/list")
    public ResponseEntity<Page<ReportDTO>> reportList(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size
    ){
        return new ResponseEntity<>(adminService.reportList(page,size), HttpStatus.OK);
    }

    //유저 차단
    @PostMapping("/report/block")
    public ResponseEntity<Report> block(Integer id){
        return new ResponseEntity<>(adminService.addBlock(id),HttpStatus.CREATED);
    }

    //차단 해제
    @DeleteMapping("/report/unlock")
    public ResponseEntity<String> unlock(Integer id){
        return new ResponseEntity<>(adminService.unlock(id),HttpStatus.OK);
    }


    //상품 목록
    @GetMapping("/product/list")
    public ResponseEntity<Page<ProductDTO>> productList(int page, int size){
        return new ResponseEntity<>(adminService.productList(page, size),HttpStatus.OK);
    }

    //대분류 목록
    @GetMapping("/product/category/list")
    public ResponseEntity<List<CategoryDTO>> categoryList(){
        return new ResponseEntity<>(adminService.categoryList(),HttpStatus.OK);
    }

    //대분류 등록
    @PostMapping("/product/category")
    public ResponseEntity<String> addCategory(String name){
        return new ResponseEntity<>(adminService.addCategory(name),HttpStatus.CREATED);
    }

    //대분류 삭제
    @DeleteMapping("/product/category")
    public ResponseEntity<String> deleteCategory(Integer id){
        return new ResponseEntity<>(adminService.deleteCategory(id),HttpStatus.OK);
    }

    //대분류 수정
    @PatchMapping("/product/category")
    public ResponseEntity<CategoryDTO> update(@RequestBody Category category){
        System.out.println(category.toString());
        return new ResponseEntity<>(adminService.updateCategory(category),HttpStatus.OK);
    }


}
