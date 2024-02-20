package com.lec.spring.controller;

import com.lec.spring.dto.ReportDTO;
import com.lec.spring.dto.analyze.SignupAnalyze;
import com.lec.spring.service.admin.AnalyzeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analyze")
public class AnalyzeController {

    private final AnalyzeService analyzeService;

    @Autowired
    public AnalyzeController(AnalyzeService analyzeService) {
        this.analyzeService = analyzeService;
    }


    //일별 회원가입자 수 통계
    @GetMapping("/signup/month")
    public ResponseEntity<List<SignupAnalyze>> dailySignUp(
            @RequestParam int year,
            @RequestParam int month
    ){
        System.out.println("daily------------------------------------------------------------");
        return new ResponseEntity<>(analyzeService.getMonthSignUp(year, month), HttpStatus.OK);
    }

    @GetMapping("/signup/year")
    public ResponseEntity<List<SignupAnalyze>> monthSignUp(
            @RequestParam("year") int year
    ) {
        System.out.println("month------------------------------------------------------------");
        return new ResponseEntity<>(analyzeService.getYearSignUp(year), HttpStatus.OK);
    }


    //총 회원수
    @GetMapping("/user/total")
    public ResponseEntity<Integer> totalUsers(){
        return new ResponseEntity<>(analyzeService.totalUsersCount(),HttpStatus.OK);
    }

}
