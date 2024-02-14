package com.lec.spring.controller;

import com.lec.spring.service.admin.AnalyzeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    @GetMapping("/analyze/signup")
    public ResponseEntity<Object> dailySignUp(
            @RequestBody Map<String, String> map
    ){
        String sort = map.get("sort");
        LocalDate startDate = LocalDate.parse(map.get("start"));
        LocalDate endDate = LocalDate.parse(map.get("end"));

        return new ResponseEntity<>(analyzeService.analyzeDate(sort, startDate, endDate), HttpStatus.OK);
    }

    //총 회원수
    @GetMapping("/analuze/user/total")
    public ResponseEntity<Integer> totalUsers(){
        return new ResponseEntity<>(analyzeService.totalUsersCount(),HttpStatus.OK);
    }
}
