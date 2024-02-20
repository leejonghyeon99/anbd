package com.lec.spring.service.admin;

import com.lec.spring.domain.ClickRank;
import com.lec.spring.domain.SearchRank;
import com.lec.spring.domain.User;
import com.lec.spring.dto.ReportDTO;
import com.lec.spring.dto.analyze.SignupAnalyze;
import com.lec.spring.repository.ClickRankRepository;
import com.lec.spring.repository.ReportRepository;
import com.lec.spring.repository.SearchRankRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyzeService {

    private final UserRepository userRepository;
    private final SearchRankRepository searchRankRepository;
    private final ClickRankRepository clickRankRepository;
    private final ReportRepository reportRepository;

    @Autowired
    public AnalyzeService(UserRepository userRepository, SearchRankRepository searchRankRepository, ClickRankRepository clickRankRepository, ReportRepository reportRepository) {
        this.userRepository = userRepository;
        this.searchRankRepository = searchRankRepository;
        this.clickRankRepository = clickRankRepository;
        this.reportRepository = reportRepository;
    }





    //사용자 일자별 회원가입 통계
    public List<SignupAnalyze> getMonthSignUp(int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        System.out.println(startDate + " / " + endDate);

        List<User> allUsers = userRepository.findAll();

        // 해당 기간 동안의 날짜 목록 생성
        List<LocalDate> dateRange = startDate.datesUntil(endDate.plusDays(1)).toList();

        Map<LocalDate, Long> dailySignUpStatistics = allUsers.stream()
                .filter(user -> !user.getCreatedAt().toLocalDate().isBefore(startDate) &&
                        !user.getCreatedAt().toLocalDate().isAfter(endDate))
                .collect(Collectors.groupingBy(
                        user -> user.getCreatedAt().toLocalDate(),
                        Collectors.counting()
                ));

        // 날짜 목록에 포함되지 않은 날짜는 가입자 수가 0으로 추가
        dateRange.forEach(date -> dailySignUpStatistics.putIfAbsent(date, 0L));

        return dailySignUpStatistics.entrySet().stream()
                .map(entry -> SignupAnalyze.builder()
                        .date(entry.getKey())
                        .count(entry.getValue())
                        .build())
                .collect(Collectors.toList());
    }


    // 사용자 1년치 월별 통계
    public List<SignupAnalyze> getYearSignUp(int year) {
        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate endDate = LocalDate.of(year, 12, 31);
        System.out.println(startDate + " / " + endDate);

        List<User> allUsers = userRepository.findAll();

        // 해당 기간 동안의 월 목록 생성
        List<String> monthRange = startDate.datesUntil(endDate)
                .map(date -> date.getYear() + "-" + date.getMonthValue()).distinct().toList();

        Map<String, Long> monthSignUpStatistics = allUsers.stream()
                .filter(user -> !user.getCreatedAt().toLocalDate().isBefore(startDate) &&
                        !user.getCreatedAt().toLocalDate().isAfter(endDate))
                .collect(Collectors.groupingBy(
                        user -> user.getCreatedAt().toLocalDate().getYear() + "-" +
                                user.getCreatedAt().toLocalDate().getMonthValue(),
                        Collectors.counting()
                ));

        // 월 목록에 포함되지 않은 월은 가입자 수가 0으로 추가
        monthRange.forEach(month -> monthSignUpStatistics.putIfAbsent(month, 0L));

        return monthSignUpStatistics.entrySet().stream()
                .map(entry -> SignupAnalyze.builder()
                        .date(LocalDate.of(
                                Integer.parseInt(entry.getKey().split("-")[0]),  // 년도
                                Integer.parseInt(entry.getKey().split("-")[1]),  // 월
                                1  // 첫째 날
                        ).plusMonths(1).minusDays(1))  // 해당 월의 마지막 날짜
                        .count(entry.getValue())
                        .build())
                .sorted(Comparator.comparing(SignupAnalyze::getDate).reversed())  // 역순으로 정렬
                .collect(Collectors.toList());
    }




    //검색순위
    public List<Object[]> searchRank(){
        return searchRankRepository.getSearchRanking();
    }

    public void logSearch(String keyword) {
        // 검색어별 검색횟수 업데이트 또는 새로운 레코드 추가
        SearchRank searchStatistic = searchRankRepository.findByKeyword(keyword);
        if (searchStatistic == null) {
            searchStatistic = new SearchRank();
            searchStatistic.setKeyword(keyword);
            searchStatistic.setSearchCount(1);
        } else {
            searchStatistic.setSearchCount(searchStatistic.getSearchCount() + 1);
        }

        searchRankRepository.save(searchStatistic);
    }

    //검색결과 클릭횟수
    public List<Object[]> clickRank(){
        return clickRankRepository.getClickRanking();
    }

    public void logClick(String result) {
        // 검색 결과 클릭 횟수 업데이트 또는 새로운 레코드 추가
        ClickRank clickStatistic = clickRankRepository.findByResult(result);
        if (clickStatistic == null) {
            clickStatistic = new ClickRank();
            clickStatistic.setResult(result);
            clickStatistic.setClickCount(1);
        } else {
            clickStatistic.setClickCount(clickStatistic.getClickCount() + 1);
        }

        clickRankRepository.save(clickStatistic);
    }

    //총 회원수
    public Integer totalUsersCount(){
        return userRepository.findAll().size();
    }

    
}
