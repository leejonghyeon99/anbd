package com.lec.spring.dto;

import com.lec.spring.domain.Report;
import com.lec.spring.domain.Review;
import com.lec.spring.domain.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportDTO {

    private Integer id;
    private String reason;
    private UserDTO user;

    public static ReportDTO toDto(Report entity){
        return ReportDTO.builder()
                .id(entity.getId())
                .reason(entity.getReason())
                .user(UserDTO.toDto(entity.getUser()))
                .build();
    }

    public static List<ReportDTO> toDtoList(List<Report> reports) {
        return reports.stream()
                .map(ReportDTO::toDto)
                .collect(Collectors.toList());
    }
}
