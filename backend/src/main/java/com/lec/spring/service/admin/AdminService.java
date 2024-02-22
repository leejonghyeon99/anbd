package com.lec.spring.service.admin;

import com.lec.spring.domain.Category;
import com.lec.spring.domain.Product;
import com.lec.spring.domain.Report;
import com.lec.spring.domain.User;
import com.lec.spring.dto.CategoryDTO;
import com.lec.spring.dto.ProductDTO;
import com.lec.spring.dto.ReportDTO;
import com.lec.spring.dto.UserDTO;
import com.lec.spring.repository.*;
import com.lec.spring.repository.product.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private UserRepository userRepository;
    private ProductRepository productRepository;
    private CategoryRepository categoryRepository;
    private RegionRepository regionRepository;
    private ReportRepository reportRepository;



    @Autowired
    public AdminService(
            UserRepository userRepository,
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            RegionRepository regionRepository,
            ReportRepository reportRepository
            ) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.regionRepository = regionRepository;
        this.reportRepository = reportRepository;
    }

    public UserDTO findUserById(int id){
        return UserDTO.toDto(userRepository.findById(id).orElse(null));
    }

    //유저 목록
    public Page<UserDTO> userList(int page) {
        PageRequest pageRequest = PageRequest.of(page, 10);

        return userRepository.findAll(pageRequest).map(UserDTO::toDto);
    }

    //신고 목록
    public Page<ReportDTO> reportList(int page, int size){
        PageRequest pageRequest = PageRequest.of(page,size);
        return reportRepository.findAll(pageRequest).map(ReportDTO::toDto);
    }

    //차단하기
    @Transactional
    public Report addBlock(int id){
        Report report = null;
        User user = userRepository.findById(id).orElse(null);
        if(user != null){
            report = new Report();
            report.setUser(user);
            return reportRepository.save(report);
        }

        return null;
    }

    @Transactional
    public String unlock(int id) {
        Report report = reportRepository.findById(id).orElse(null);
        if (report != null) {
            reportRepository.deleteById(id);// 차단 성공
            return "OK";
        }
        return "FAIL";
    }

    public Page<ProductDTO> productList(int page, int size){
        PageRequest pageRequest = PageRequest.of(page, size);
        return productRepository.findAll(pageRequest).map(ProductDTO::toDto);
    }

    //대분류 목록
    public List<CategoryDTO> categoryList() {
        return CategoryDTO.toDtoList(
                categoryRepository.findAll()
                        .stream()

                        .collect(Collectors.toList())
        );
    }

    //대분류 추가
    @Transactional
    public String addCategory(String main){

        if(categoryRepository.findByMain(main).isPresent()){
            return "중복 되었습니다.";
        }

        Category category = new Category();
        category.setMain(main);
        categoryRepository.save(category);
        return "등록 성공";
    }


    //대분류 카테고리 삭제
    @Transactional
    public String deleteCategory(int id){
        if(categoryRepository.findById(id).isEmpty()){
            return "삭제할 데이터가 없습니다.";
        }
        categoryRepository.deleteById(id);
        return "삭제 성공";
    }


    //대분류 카테고리 수정
    @Transactional
    public CategoryDTO updateCategory(Category category){
        if(categoryRepository.findById(category.getId()).isPresent()){
            return CategoryDTO.toDto(categoryRepository.save(category));
        }
        return CategoryDTO.toDto(category);

    }





}
