package com.lec.spring.service.admin;

import com.lec.spring.domain.ClickRank;
import com.lec.spring.domain.SearchRank;
import com.lec.spring.domain.User;
import com.lec.spring.repository.ClickRankRepository;
import com.lec.spring.repository.SearchRankRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyzeService {

    private final UserRepository userRepository;
    private final SearchRankRepository searchRankRepository;
    private final ClickRankRepository clickRankRepository;

    @Autowired
    public AnalyzeService(UserRepository userRepository, SearchRankRepository searchRankRepository, ClickRankRepository clickRankRepository) {
        this.userRepository = userRepository;
        this.searchRankRepository = searchRankRepository;
        this.clickRankRepository = clickRankRepository;
    }


    public Object analyzeDate(String sort, LocalDate startDate, LocalDate endDate){
        if(sort.equals("daily")){
            return getDailySignUp(startDate, endDate);
        }
        return getMonthSignUp(startDate, endDate);
    }



    //사용자 일자별 회원가입 통계
    public Map<LocalDate, Long> getDailySignUp(LocalDate startDate, LocalDate endDate) {
        List<User> allUsers = userRepository.findAll();

        // 특정 기간 내의 데이터 필터링
        List<User> usersInPeriod = allUsers.stream()
                .filter(user -> !user.getCreatedAt().toLocalDate().isBefore(startDate) &&
                        !user.getCreatedAt().toLocalDate().isAfter(endDate))
                .toList();

        // Java 8 Stream API를 사용하여 일자별 회원가입 통계 생성 및 날짜별로 정렬, 역순으로 정렬
        Map<LocalDate, Long> dailySignUpStatistics = usersInPeriod.stream()
                .collect(Collectors.groupingBy(
                        user -> user.getCreatedAt().toLocalDate(),
                        Collectors.counting()
                ));

        // 날짜별로 정렬, 역순으로 정렬된 LinkedHashMap 반환
        return dailySignUpStatistics.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey(Comparator.reverseOrder()))
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }
    public Map<String, Long> getMonthSignUp(LocalDate startDate, LocalDate endDate) {
        List<User> allUsers = userRepository.findAll();

        // 특정 기간 내의 데이터 필터링
        List<User> usersInPeriod = allUsers.stream()
                .filter(user -> !user.getCreatedAt().toLocalDate().isBefore(startDate) &&
                        !user.getCreatedAt().toLocalDate().isAfter(endDate))
                .toList();

        // Java 8 Stream API를 사용하여 월별 회원가입 통계 생성 및 날짜별로 정렬, 역순으로 정렬
        Map<String, Long> monthSignUpStatistics = usersInPeriod.stream()
                .collect(Collectors.groupingBy(
                        user -> user.getCreatedAt().toLocalDate().getYear() + "-" +
                                user.getCreatedAt().toLocalDate().getMonthValue(),
                        Collectors.counting()
                ));

        // 날짜별로 정렬, 역순으로 정렬된 LinkedHashMap 반환
        return monthSignUpStatistics.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey(Comparator.reverseOrder()))
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
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
