package com.lec.spring.controller;

import com.lec.spring.service.admin.AnalyzeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/analyze")
public class AnalyzeController {

    private final AnalyzeService analyzeService;

    @Autowired
    public AnalyzeController(AnalyzeService analyzeService) {
        this.analyzeService = analyzeService;
    }


    //월, 일별 회원가입자 수 통계
    @GetMapping("/signup")
    public ResponseEntity<Object> dailySignUp(
            @RequestParam String sort,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ){
        return new ResponseEntity<>(analyzeService.analyzeDate(sort, startDate, endDate), HttpStatus.OK);
    }

    //총 회원수
    @GetMapping("/user/total")
    public ResponseEntity<Integer> totalUsers(){
        return new ResponseEntity<>(analyzeService.totalUsersCount(),HttpStatus.OK);
    }
}
