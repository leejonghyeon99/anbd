package com.lec.spring.util;

import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;

public class Init {
    //아무 의미 없는 클래스
    //초기 폴더 구조 잡는용

    public static void printFileInfo(MultipartFile file) {
        String originalFileName = file.getOriginalFilename();   // 원본 이름

        if(originalFileName == null || originalFileName.length() == 0){
            System.out.println("\t파일이 없습니다");
            return;
        }
        System.out.println("\tOriginal File Name : " + originalFileName);
        System.out.println("\tCleanPath : " + StringUtils.cleanPath(originalFileName));
        System.out.println("\tFile Size : " + file.getSize() + " bytes");  // 용량 (byte)
        System.out.println("\tMIME: " + file.getContentType());  // content type (mime type)

        // 이미지 파일 여부
        BufferedImage bufferedImage = null;

        try {
            bufferedImage = ImageIO.read(file.getInputStream());

            if(bufferedImage != null){
                System.out.printf("\t이미지 파일입니다: %d x %d\n", bufferedImage.getWidth(), bufferedImage.getHeight());
            } else {
                System.out.println("\t이미지 파일이 아닙니다");
            }

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
