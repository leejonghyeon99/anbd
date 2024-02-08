package com.lec.spring.controller;

import com.lec.spring.domain.User;
import com.lec.spring.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {


    private AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }




    //유저 목록
    @GetMapping("/user/list")
    public ResponseEntity<List<User>> userList(){
        return new ResponseEntity<>(adminService.userList(), HttpStatus.OK);
    }
}
