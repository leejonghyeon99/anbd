package com.lec.spring.service.product;

import com.lec.spring.domain.Category;
import com.lec.spring.domain.Product;
import com.lec.spring.domain.ProductImage;
import com.lec.spring.domain.User;
import com.lec.spring.dto.CategoryDTO;
import com.lec.spring.dto.ProductDTO;
import com.lec.spring.dto.ProductsDTO;
import com.lec.spring.repository.CategoryRepository;
import com.lec.spring.repository.UserRepository;
import com.lec.spring.repository.product.ProductImageRepository;
import com.lec.spring.repository.product.ProductRepository;
import com.lec.spring.service.UserService;
import com.lec.spring.util.Init;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.hibernate.procedure.ProcedureOutputs;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductService {

    @Value("${app.upload.product.path}")
    private String uploadDir;

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    // 등록
    public Product write(ProductsDTO product, List<MultipartFile> files){
        System.out.println(product + "저장전");
        System.out.println(files + "저장전");
        Category category = categoryRepository.findUnique(product.getCategoryMain(),product.getCategorySub());
        System.out.println(category);

//        User user = userRepository.findByUsername(userService.getUser().get().getUsername()).orElse(null);
        User user = userRepository.findById(product.getUser_id()).orElse(null);
//        User user = userService.getUser().get();
//        userRepository.findByUsername(user.getUsername());
        System.out.println("user~~~~~~~~~~~~~~~~~~~" + user);

        Product productnew = Product.builder()
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .status(product.getStatus())
                .category(category)
                .location(product.getLocation())
                .user(user)
                .fileList(product.getFileList())
                .build();
        System.out.println("+++++++++++++++++++++++++++++++++++++++++" + productnew);

        System.out.println("~~~~~~~~~~~");
        Product sProduct = productRepository.save(productnew);
        System.out.println(product + "저장 후");
        // 제품을 save 한 후 id값을 가져옴
        Long productId = sProduct.getId();
        System.out.println("productID가 나와야함: " + productId);
        // 파일 추가
        addFiles(files, productId);
        return sProduct;
    }


//    public ProductDTO write(Product product, List<MultipartFile> files){
//        System.out.println(product);
//        String main = product.getCategory().getMain();
//        String sub = product.getCategory().getSub();
//        Category category = categoryRepository.findUnique(main, sub);
//        product.setCategory(category);
//        productRepository.saveAndFlush(product);
//        User writer = userRepository.findById(product.getUser().getId()).orElse(null);
//        product.setUser(writer);
//        // 파일 추가
////         addFiles(files, product.getId());
//        Product sProduct = productRepository.save(product);
//        // 제품을 save 한 후 id값을 가져옴
//        Long productId = sProduct.getId();
//        // 파일 추가
//        addFiles(files, productId);
//        return ProductDTO.toDto(product);
//    }


    // ProductService에서 Product를 조회하는 메서드 추가
    public Product findProductById(Long id) {
        // Product를 id로 조회하는 코드를 작성하여 반환
        System.out.println("id = " + id);
        return productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("product_id를 못찾아요"));
    }

    // 특정 글(id) 첨부파일(들) 추가
//    private void addFiles(List<MultipartFile> files, Long id) {
//        if (files != null) {
//            for (var e : files) {
//                // name="upfile##" 인 경우만 첨부파일 등록. (이유, 다른 웹에디터와 섞이지 않도록..ex: summernote)
////                if (!startsWith("upfile")) continue;
//
//                // 첨부 파일 정보 출력
//                System.out.println("\n첨부파일 정보: " + e);   // name값
//                Init.printFileInfo(e);   // 파일 정보 출력
//                System.out.println();
//
//                // 물리적인 파일 저장
//                ProductImage file = upload(e);
//
//                // 성공하면 DB 에도 저장
//                if (file != null) {
//                    // ProductService를 사용하여 id를 이용하여 Product를 조회
//                    Product product = findProductById(id);
//                    if (product != null) {
//                        file.setProduct(product); // 조회한 Product 객체를 설정
//                        productImageRepository.saveAndFlush(file);
//                    }


    private void addFiles(List<MultipartFile> files, Long productId) {
        if (files != null) {
            for (MultipartFile file : files) {
                // 첨부 파일 정보 출력
                System.out.println("\n첨부파일 정보: " + file.getOriginalFilename());   // 파일 이름 출력
                // 파일 정보 출력
                System.out.println("파일 크기: " + file.getSize());
                System.out.println("컨텐츠 타입: " + file.getContentType());
                System.out.println();
                // 물리적인 파일 저장
                ProductImage productImage = upload(file);

                // 성공하면 DB 에도 저장
                if (productImage != null) {
                    // ProductService를 사용하여 id를 이용하여 Product를 조회
                    // 여기서 문제임
                    Product product = findProductById(productId);
                    User user = product.getUser();
                    if (product != null) {
                        productImage.setProduct(product); // 조회한 Product 객체를 설정
                        productImage.setUser(user);
                        productImageRepository.saveAndFlush(productImage);
                    }
                    System.out.println("======== productImage ========" + productImage);
                    System.out.println("======== 이미지 DB 저장 ========");
                }
            }
        }
        System.out.println("addFile() 실행");
    }// end addFiles()

    // 물리적으로 파일 저장.  중복된 이름 rename 처리
    private ProductImage upload(MultipartFile multipartFile) {
        ProductImage productImage = null;

        // 담긴 파일이 없으면 pass
        String originalFilename = multipartFile.getOriginalFilename();
        System.out.println("original" + originalFilename);
        if(originalFilename == null || originalFilename.length() == 0) return null;

        // 원본파일명
        String originName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
        // 저장될 파일명
        String photoName = originName;

        // 파일명 이 중복되는지 확인
        File file = new File(uploadDir, originName);
        if(file.exists()){  // 이미 존재하는 파일명,  중복되면 다름 이름으로 변경하여 저장
            // a.txt => a_2378142783946.txt  : time stamp 값을 활용할거다!
            int pos = photoName.lastIndexOf(".");
            if(pos > -1){   // 확장자가 있는 경우
                String name = photoName.substring(0, pos);  // 파일 '이름'
                String ext = photoName.substring(pos + 1);   // 파일 '확장자'

                // 중복방지를 위한 새로운 이름 (현재시간 ms) 를 파일명에 추가
                photoName = name + "_" + System.currentTimeMillis() + "." + ext;
            } else {  // 확장자가 없는 경우
                photoName += "_" + System.currentTimeMillis();
            }
        }
        // 저장할 파일명
        System.out.println("photoName: " + photoName);

        // java.nio
        Path copyOfLocation = Paths.get(new File(uploadDir, photoName).getAbsolutePath());
        System.out.println("저장 경로: " + copyOfLocation);

        try {
            // inputStream을 가져와서
            // copyOfLocation (저장위치)로 파일을 쓴다.
            // copy의 옵션은 기존에 존재하면 REPLACE(대체한다), 오버라이딩 한다

            Files.copy(
                    multipartFile.getInputStream(),
                    copyOfLocation,
                    StandardCopyOption.REPLACE_EXISTING    // 기존에 존재하면 덮어쓰기
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        productImage = ProductImage.builder()
                .photoName(photoName)   // 저장된 이름
                .originName(originName)  // 원본 이름
                .build();

        return productImage;
    }

    // 목록
    @Transactional
    public List<ProductDTO> list(String sub, String search) {
        Category category = categoryRepository.findBySub(sub).orElse(null);
          List<ProductDTO> list = ProductDTO.toDtoList(productRepository.getProductBySub(category.getId()));
        return list;

    }

    // 상세
    @Transactional
    public ProductDTO detail(Long id){
        Product product = productRepository.findById(id).orElse(null);
//        User user = userRepository.findById(product.getUser().getId()).orElse(null);
//        product.getUser().getId()
//        product.setUser(user);

        User user = userService.getUser().get();
        System.out.println("user~~~~~~~~~~~~~~~~~~~" + user);

//        List<ProductImage> fileList = productImageRepository.findByProduct(product.getId());
//        product.setFileList(fileList);
        return ProductDTO.toDto(product);
    }

    // 수정
    @Transactional
    public ProductDTO update(ProductDTO product, MultipartFile files, Long[] delfile) {
        System.out.println(product.toString());
        Product productEntity = productRepository.findById(product.getId()).orElse(null);
//        Category category = categoryRepository.findById(product.getCategory().getId()).orElse(null);

        String main = product.getCategory().getMain();
        String sub = product.getCategory().getSub();
        Category category = categoryRepository.findUnique(main, sub);

        if (category != null) {
            category.setMain(product.getCategory().getMain());
            category.setSub(product.getCategory().getSub());

            categoryRepository.save(category);

            productEntity.setLocation(product.getLocation());   // 위치
            productEntity.setTitle(product.getTitle());
            productEntity.setPrice(product.getPrice());
            productEntity.setStatus(product.getStatus());
            productEntity.setDescription(product.getDescription());
            productEntity.setCategory(category);
            productEntity.setRefreshedAt(product.getRefreshedAt());  // 끌어올리기
            productRepository.save(productEntity);
        }
//        addFiles(files, product.getId());

        // 삭제할 첨부파일(들) 삭제
//        if (delfile != null) {
//            for (Integer id : delfile) {
//                ProductImage file = productImageRepository.findById(id);
//                if (file != null) {
//                    delFile(file);  // 물리적으로 파일 삭제
//                    productImageRepository.delete(file);  // DB 에서 삭제
//                }
//            }
//        }
        return ProductDTO.toDto(productEntity);
    }

    // 특정 첨부파일(id) 를 물리적으로 삭제
    private void delFile(ProductImage file) {
        String saveDirectory = new File(uploadDir).getAbsolutePath();
        File f = new File(saveDirectory, file.getPhotoName());   // 물리적으로 저장된 파일들이 삭제 대상
        System.out.println("삭제시도 --> " + f.getAbsolutePath());

        if (f.exists()) {
            if (f.delete()) {
                System.out.println("삭제 성공");
            } else {
                System.out.println("삭제 실패");
            }
        } else {
            System.out.println("파일이 존재하지 않습니다.");
        }
    }

    // 삭제
    @Transactional
    public String delete(Long id){
        boolean isexists = productRepository.existsById(id);
        if (!isexists) return "FAIL";
        // 물리적으로 저장된 첨부파일(들) 삭제
//        List<ProductImage> fileList = productImageRepository.findByProduct(id);
//        if (fileList != null) {
//            for (ProductImage file : fileList) {
//                delFile(file);
//            }
//        }
        productRepository.deleteById(id);
        return "OK";
    }

    // 특정 main으로 sub 가져오기 카테고리
    public List<CategoryDTO> findByMainForSub (String main){
        System.out.println("main : ========================" + main);
        return CategoryDTO.toDtoList(categoryRepository.findAllGroupMain(main).orElse(null));
    }
    // main만 가져오기 카테고리
    public List<String> findByMainForList (){
        return categoryRepository.findAllOnlyMain().orElse(null);
    }
    // sub만 가져오기 카테고리
    public List<CategoryDTO> findBySubForList (){
        System.out.println("---------------------------------------------");
        System.out.println(categoryRepository.findAllOnlySub().orElse(null));
        return CategoryDTO.toDtoList( categoryRepository.findAllOnlySub().orElse(null));
    }
}