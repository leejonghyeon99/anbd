package com.lec.spring.service.user;

import com.lec.spring.domain.Product;
import com.lec.spring.domain.Status;
import com.lec.spring.domain.User;
import com.lec.spring.dto.ProductDTO;
import com.lec.spring.repository.product.ProductRepository;
import com.lec.spring.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserInfoService {

    private final UserService userService;
    private final ProductRepository productRepository;

    //판매내역
    @Transactional
    public Page<ProductDTO> getSoldList(int page, int size) {
        User user = userService.getUser().orElseThrow(() -> new RuntimeException("User not found"));

        // 페이지 번호를 0부터 시작하도록 조정
        int adjustedPage = page - 1 < 0 ? 0 : page - 1;

        // 내림차순으로 정렬하도록 설정
        Pageable pageable = PageRequest.of(adjustedPage, size, Sort.by("id").descending());

        // 정렬된 페이지를 가져옴
        Page<Product> productPage = productRepository.findByUserIdAndStatus(pageable, user.getId(), Status.SOLD);

        //총 페이지 수
        int total = productPage.getTotalPages();

        // 페이지 번호가 초과될 때 마지막 페이지의 내용을 반환
        if (adjustedPage >= total) {
            Pageable lastPage = PageRequest.of(total-1,size,Sort.by("id").descending());
            return productRepository.findByUserIdAndStatus(lastPage, user.getId(), Status.SOLD).map(ProductDTO::toDto);
        }

        return productPage.map(ProductDTO::toDto);
    }


}
