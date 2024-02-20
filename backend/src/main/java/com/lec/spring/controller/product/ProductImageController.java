package com.lec.spring.controller.product;

import com.lec.spring.domain.ProductImage;
import com.lec.spring.service.product.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.RequestMapping;
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

    private ProductImageService productImageService;

    @RequestMapping("/product/download")
    public ResponseEntity<Object> download(Integer id) {
        if (id == null) return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);  // 400

        ProductImage file = productImageService.findByImageId(id);
        if (file == null) return new ResponseEntity<>(null, HttpStatus.NOT_FOUND); // 404

        String originName = file.getOriginName();  // 원본이름
        String photoName = file.getPhotoName(); // 저장된 파일명

        String path = new File(originName, photoName).getAbsolutePath();

        try {
            // 파일 유형 (Mimetype) 추출
            String mimeType = Files.probeContentType(Paths.get(path));

            // 유형이 지정되지 않은 경우
            if (mimeType == null) {
                mimeType = "application/octet-stream";  // 일련의 8bit 스트림 타입.  유형이 알려지지 않은 파일에 대한 형식 지정
            }

            Path filePath = Paths.get(path);
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
}
