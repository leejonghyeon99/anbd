package com.lec.spring.service;

import com.lec.spring.domain.Product;
import com.lec.spring.domain.User;
import com.lec.spring.domain.WishList;
import com.lec.spring.dto.ProductDTO;
import com.lec.spring.repository.WishListRepsitory;
import com.lec.spring.repository.product.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class WishListService {
    private WishListRepsitory wishListRepsitory;
    private ProductRepository productRepository;

    // 유저 및 상품 정보로 가져오기
//    @Transactional
//    public WishList liked(Integer productId, Integer userId){
//
//        // 좋아요 했는 지 확인
//        Optional<WishList> existLike = wishListRepsitory.findByUserIdAndProductId(userId, productId);
//        // 좋아요한 상태면 취소
//        if(existLike.isPresent()){
//            wishListRepsitory.delete(existLike.get());
//        } else { // 좋아요 추가
//            WishList wishList = new WishList();
//            wishList.setId(wishList.getId());
//            wishList.setUser(wishList.getUser());
//            wishList.setProduct(wishList.getProduct());
//            wishList = wishListRepsitory.save(wishList);
//            System.out.println("wishList save: "+wishList);
//            return wishList;
//        }
//        return null;
//    }
//    public ResponseEntity<ProductDTO> likeProduct(Long id, User user){
//        Optional<Product> product = productRepository.findById(id); // 1
//        if(product.isEmpty()){
//            re
//        }
//        // 좋아요 누른 적 있는지 확인
//        Optional<WishList> wishFound = wishListRepsitory.findByUserIdAndProductId(product.get(), user);
//        if (wishFound.isEmpty()){   // 좋아요 누른 적 없음
//            WishList wishList = WishList.of(product.get(), user);   // 2
//            wishListRepsitory.save(wishList);   // 3
//        } else {
//            wishListRepsitory.delete(wishFound.get());  // 좋아요 눌렀던 정보 삭제
//            wishListRepsitory.flush();
//        }
//        return ResponseEntity.ok(ProductDTO, from(product.get()));  // 4
//    }
}
