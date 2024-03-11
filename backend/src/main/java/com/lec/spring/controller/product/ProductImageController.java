package com.lec.spring.controller.product;

import com.lec.spring.domain.ProductImage;
import com.lec.spring.service.product.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequiredArgsConstructor
public class ProductImageController {
    // 다운로드하는 로직

    @Value("${app.upload.product.path}")
    private String uploadDir;

    private final ProductImageService productImageService;

    @RequestMapping("/product/download")
    public ResponseEntity<Object> download(Integer id) {
        if (id == null) return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);  // 400

        ProductImage file = productImageService.findByImageId(id);
        if (file == null) return new ResponseEntity<>(null, HttpStatus.NOT_FOUND); // 404

        String originName = file.getOriginName();  // 원본이름
        String photoName = file.getPhotoName(); // 저장된 파일명

//        String path = new File(originName, photoName).getAbsolutePath();
        String path = Paths.get(uploadDir, photoName).toString();
        System.out.println("path : " + path);

        try {
            // 파일 유형 (Mimetype) 추출
            String mimeType = Files.probeContentType(Paths.get(path));

            // 유형이 지정되지 않은 경우
            if (mimeType == null) {
                mimeType = "application/octet-stream";  // 일련의 8bit 스트림 타입.  유형이 알려지지 않은 파일에 대한 형식 지정
            }

            Path filePath = Paths.get(path);
            System.out.println("filePath : " + filePath);
            Resource resource = new InputStreamResource(Files.newInputStream(filePath));

            // response header 세팅
            HttpHeaders headers = new HttpHeaders();
            // ↓ 원본 파일 이름(sourceName) 으로 다운로드 하게 하기위한 세팅
            headers.setContentDisposition(ContentDisposition.builder("attachment").filename(URLEncoder.encode(originName, "utf-8")).build());
            headers.setCacheControl("no-cache");
            headers.setContentType(MediaType.parseMediaType(mimeType));

            // ResponseEntity<T> 리턴 (body, header, status)
            return new ResponseEntity<>(resource, headers, HttpStatus.OK);  // 200

        } catch (IOException e) {
            return new ResponseEntity<>(null, HttpStatus.CONFLICT);  // 409
        }
    }

//    @GetMapping("/product/image")
//    public ResponseEntity<Resource> showImage(@RequestParam Integer id) {
//        if (id == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 400: 잘못된 요청
//
//        ProductImage file = productImageService.findByImageId(id);
//        if (file == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404: 이미지가 데이터베이스에 없음
//
//        Path filePath = Paths.get(uploadDir, file.getPhotoName());
//        if (!Files.exists(filePath)) {
//            // 파일이 실제로 존재하지 않는 경우
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404: 파일 시스템에 이미지가 없음
//        }
//
//        try {
//            String mimeType = Files.probeContentType(filePath);
//            if (mimeType == null) {
//                mimeType = "application/octet-stream";
//            }
//
//            Resource resource = new InputStreamResource(Files.newInputStream(filePath));
//
//            return ResponseEntity.ok()
//                    .contentType(MediaType.parseMediaType(mimeType))
//                    .body(resource);
//
//        } catch (IOException e) {
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500: 서버 내부 오류
//        }
//    }

}
