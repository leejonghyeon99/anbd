package com.lec.spring.repository;

import com.lec.spring.domain.SearchRank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SearchRankRepository extends JpaRepository<SearchRank, Long> {

    @Query("SELECT s.keyword, s.searchCount FROM SearchRank s ORDER BY s.searchCount DESC")
    List<Object[]> getSearchRanking();

    SearchRank findByKeyword(String keyword);
}
