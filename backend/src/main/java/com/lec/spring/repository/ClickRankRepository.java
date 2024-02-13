package com.lec.spring.repository;

import com.lec.spring.domain.ClickRank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ClickRankRepository extends JpaRepository<ClickRank, Long> {

    @Query("SELECT c.result, c.clickCount FROM ClickRank c ORDER BY c.clickCount DESC")
    List<Object[]> getClickRanking();

    ClickRank findByResult(String result);
}
