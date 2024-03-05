package com.lec.spring.dto;

import com.lec.spring.domain.ProductImage;
import com.lec.spring.domain.Status;
import com.lec.spring.domain.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.catalina.authenticator.SavedRequest;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductsDTO {

    private Long id;
    private String title;
    private String description;
    private int price;
    private Status status;
    private String location;
    private LocalDateTime refreshed_at;
    private String  categoryMain;
    private String  categorySub;

    private List<ProductImage> fileList;
//    private User user;

    private Integer user_id;
}
