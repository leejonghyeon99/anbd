package com.lec.spring.service;

import com.lec.spring.domain.User;
import com.lec.spring.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private UserRepository userRepository;
    private ProductRepository productRepository;
    private CategoryRepository categoryRepository;
    private RegionRepository regionRepository;
    private ReportRepository reportRepository;


    @Autowired
    public AdminService(UserRepository userRepository, ProductRepository productRepository, CategoryRepository categoryRepository, RegionRepository regionRepository, ReportRepository reportRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.regionRepository = regionRepository;
        this.reportRepository = reportRepository;
    }

    //유저 목록
    public List<User> userList(){
        PageRequest pageRequest = PageRequest.of(0,5);
        return userRepository.findAll(pageRequest).stream().toList();
    }


}
