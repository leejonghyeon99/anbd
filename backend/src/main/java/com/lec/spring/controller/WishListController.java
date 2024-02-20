package com.lec.spring.controller;

import com.lec.spring.repository.WishListRepsitory;
import com.lec.spring.service.WishListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class WishListController {

    private WishListService wishListService;

    @PostMapping("/like")
    public ResponseEntity<?> likeProduct(@PathVariable Integer userId, Integer productId){
//        return new ResponseEntity<>(wishListService.liked(productId, productId), HttpStatus.OK);
        return null;
    }
}
