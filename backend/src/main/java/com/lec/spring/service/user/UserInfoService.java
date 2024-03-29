package com.lec.spring.service.user;

import com.lec.spring.domain.Product;
import com.lec.spring.domain.Status;
import com.lec.spring.domain.User;
import com.lec.spring.domain.WishList;
import com.lec.spring.dto.ProductDTO;
import com.lec.spring.dto.UserDTO;
import com.lec.spring.dto.WishListDTO;
import com.lec.spring.repository.UserRepository;
import com.lec.spring.repository.WishListRepsitory;
import com.lec.spring.repository.product.ProductRepository;
import com.lec.spring.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserInfoService {

    private final UserService userService;
    private final ProductRepository productRepository;
    private final WishListRepsitory wishListRepsitory;
    private final UserRepository userRepository;


    @Value("${app.upload.thumbnail.path}")
    private String uploadPath;


    //판매내역
    @Transactional
    public Page<ProductDTO> getProductList(int page, int size, Status status) {
        User user = userService.getUser().orElseThrow(() -> new RuntimeException("User not found"));

        // 페이지 번호를 0부터 시작하도록 조정
        int adjustedPage = page - 1 < 0 ? 0 : page - 1;

        // 내림차순으로 정렬하도록 설정
        Pageable pageable = PageRequest.of(adjustedPage, size, Sort.by("id").descending());

        // 정렬된 페이지를 가져옴
        Page<Product> productPage;
        if(status != null){
            productPage = productRepository.findByUserIdAndStatus(pageable, user.getId(), status);
        }else{
            productPage = productRepository.findByUserId(pageable, user.getId());
        }

        //총 페이지 수
        int total = productPage.getTotalPages();

        // 페이지 번호가 초과될 때 마지막 페이지의 내용을 반환
        if (adjustedPage >= total && total > 0) {
            if (adjustedPage >= total) {
                // 마지막 페이지의 pageable 객체 생성
                Pageable lastPageable = PageRequest.of(total - 1, size, Sort.by("id").descending());
                if (status != null) {
                    return productRepository.findByUserIdAndStatus(lastPageable, user.getId(), status).map(ProductDTO::toDto);
                } else {
                    return productRepository.findByUserId(lastPageable, user.getId()).map(ProductDTO::toDto);
                }
            }
        }

        return productPage.map(ProductDTO::toDto);
    }




    @Transactional
    public Page<WishListDTO> getWishList(int page, int size) {
        User user = userService.getUser().orElseThrow(() -> new RuntimeException("User not found"));

        if(user == null) {
            return null;
        }

        // 페이지 번호를 0부터 시작하도록 조정
        int adjustedPage = page - 1 < 0 ? 0 : page - 1;

        // 내림차순으로 정렬하도록 설정
        Pageable pageable = PageRequest.of(adjustedPage, size, Sort.by("id").descending());

        // 정렬된 페이지를 가져옴
        Page<WishList> wishListPage = wishListRepsitory.findByUserId(pageable, user.getId());
        //
        //총 페이지 수
        int total = wishListPage.getTotalPages();

        // 페이지 번호가 초과될 때 마지막 페이지의 내용을 반환
        if (adjustedPage >= total) {
            Pageable lastPage = PageRequest.of(total-1,size,Sort.by("id").descending());
            return wishListRepsitory.findByUserId(lastPage, user.getId()).map(WishListDTO::toDto);
        }

        return wishListPage.map(WishListDTO::toDto);
    }

    public void test(){
        System.out.println(wishListRepsitory.findAll());
    }

    //썸네일 변경
//    public UserDTO changeImg(MultipartFile file){
//        User user = userService.getUser().get();
//
//        if(user == null){
//            return null;
//        }
//
//        user.setThumbnail(file.getOriginalFilename());
//
//        userRepository.save(user);
//        return UserDTO.toDto(user);
//    }

    public UserDTO changeImg(MultipartFile file) {
        User user = userService.getUser().get();
        // 업로드 폴더가 존재하지 않으면 생성합니다.
        File uploadFolder = new File(uploadPath);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        // 업로드된 파일의 이름을 생성합니다.
        String originalFileName = file.getOriginalFilename();
        String fileName = generateUniqueFileName(originalFileName);

        // 업로드 경로와 파일 이름을 조합하여 저장할 파일 경로를 만듭니다.
        Path savePath = Path.of(uploadPath, "thumbnail", fileName);

        try {
            // 파일을 지정된 경로로 복사합니다.
            Files.copy(file.getInputStream(), savePath, StandardCopyOption.REPLACE_EXISTING);
            user.setThumbnail(fileName);

            userRepository.save(user);
            return UserDTO.toDto(user);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    private String generateUniqueFileName(String originalFileName) {
        // 파일 이름에 현재 시간을 추가하여 유일한 파일 이름 생성
        Instant now = Instant.now();
        ZonedDateTime zonedDateTime = ZonedDateTime.ofInstant(now, ZoneId.systemDefault());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
        String timestamp = formatter.format(zonedDateTime);

        // 확장자 추출
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));

        return originalFileName + timestamp + fileExtension;
    }
}
