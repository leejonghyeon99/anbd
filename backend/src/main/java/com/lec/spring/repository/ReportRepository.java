package com.lec.spring.repository;

import com.lec.spring.domain.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report,Integer> {
}
