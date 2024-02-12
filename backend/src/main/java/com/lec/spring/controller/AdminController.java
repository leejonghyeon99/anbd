package com.lec.spring.controller;

import com.lec.spring.domain.Report;
import com.lec.spring.domain.User;
import com.lec.spring.dto.UserDTO;
import com.lec.spring.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {


    private AdminService adminService;

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
    public ResponseEntity<List<User>> userList(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size
    ){
        return new ResponseEntity<>(adminService.userList(page,size), HttpStatus.OK);
    }

    //신고 목록
    @GetMapping("/report/list")
    public ResponseEntity<List<Report>> reportList(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size
    ){
        return new ResponseEntity<>(adminService.reportList(page,size), HttpStatus.OK);
    }

    //유저 차단

}
