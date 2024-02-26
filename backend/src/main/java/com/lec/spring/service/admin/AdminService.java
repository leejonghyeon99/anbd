package com.lec.spring.service.admin;

import com.lec.spring.domain.Category;
import com.lec.spring.domain.Product;
import com.lec.spring.domain.Report;
import com.lec.spring.domain.User;
import com.lec.spring.dto.CategoryDTO;
import com.lec.spring.dto.ProductDTO;
import com.lec.spring.dto.ReportDTO;
import com.lec.spring.dto.UserDTO;
import com.lec.spring.dto.exception.Response;
import com.lec.spring.repository.*;
import com.lec.spring.repository.product.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@NoArgsConstructor
public class AdminService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private RegionRepository regionRepository;
    @Autowired
    private ReportRepository reportRepository;



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
                categoryRepository.findAll(Sort.by(Sort.Order.asc("id")))
        );
    }

    //대분류 추가
    @Transactional
    public Response<?> addCategory(CategoryDTO dto){

        if(categoryRepository.findByMain(dto.getMain()).isPresent() && categoryRepository.findBySub(dto.getSub()).isPresent()){
            return Response.error("duple");
        }

        Category category = CategoryDTO.toEntity(dto);

        categoryRepository.save(category);
        List<Category> categories = categoryRepository.findAll(Sort.by(Sort.Order.asc("id")));
        return Response.success(CategoryDTO.toDtoList(categories));
    }


    //대분류 카테고리 삭제
    @Transactional
    public Response<?> deleteCategory(int id){
        if(categoryRepository.findById(id).isEmpty()){
            return Response.error("삭제할 데이터가 없습니다.");
        }
        categoryRepository.deleteById(id);
        List<Category> categories = categoryRepository.findAll(Sort.by(Sort.Order.asc("id")));
        return Response.success(CategoryDTO.toDtoList(categories));
    }


    //대분류 카테고리 수정
    @Transactional
    public Response<?> updateCategory(Category category){
        if(categoryRepository.findById(category.getId()).isPresent()){
            categoryRepository.save(category);
            List<Category> categories = categoryRepository.findAll(Sort.by(Sort.Order.asc("id")));
            return Response.success(CategoryDTO.toDtoList(categories));
        }else{
            return Response.error("수정할 카테고리가 존재하지 않습니다.");
        }


    }


    @Transactional
    public Response<?> addSubCategory(CategoryDTO dto){


        Category category = CategoryDTO.toEntity(dto);

        categoryRepository.save(category);
        List<Category> categories = categoryRepository.findAll(Sort.by(Sort.Order.asc("id")));
        return Response.success(CategoryDTO.toDtoList(categories));
    }

    //중분류 카테고리 삭제
    @Transactional
    public Response<?> deleteChildCategory(Category category){

        categoryRepository.deleteSub(category.getMain(),category.getSub());

        return Response.success("ok");
    }


    //중분류 카테고리 수정
    @Transactional
    public Response<?> updateChildCategory(Category category, String change){
        System.out.println(category.toString());
        System.out.println(change);
        categoryRepository.updateSub(change, category.getMain(), category.getSub());
        return Response.success("ok");


    }






}
