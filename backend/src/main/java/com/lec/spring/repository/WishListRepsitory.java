package com.lec.spring.repository;

import com.lec.spring.domain.WishList;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface WishListRepsitory extends JpaRepository<WishList, Integer> {

    Optional<WishList> findByUserIdAndProductId(Integer productId, Integer userId);
}
