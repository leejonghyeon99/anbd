package com.lec.spring.service.product;

import com.lec.spring.domain.Category;
import com.lec.spring.domain.Product;
import com.lec.spring.domain.ProductImage;
import com.lec.spring.domain.User;
import com.lec.spring.dto.CategoryDTO;
import com.lec.spring.dto.ProductDTO;
import com.lec.spring.dto.ProductImageDTO;
import com.lec.spring.dto.ProductsDTO;
import com.lec.spring.repository.CategoryRepository;
import com.lec.spring.repository.UserRepository;
import com.lec.spring.repository.product.ProductImageRepository;
import com.lec.spring.repository.product.ProductRepository;
import com.lec.spring.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    @Value("${app.upload.product.path}/")
    private String uploadDir;

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Transactional
    // 등록
    public Product write(ProductsDTO product, List<MultipartFile> files){
        Category category = categoryRepository.findUnique(product.getCategoryMain(),product.getCategorySub());
        User user_id = userRepository.findById(product.getUser_id()).orElse(null);
        System.out.println("product user_id : " + user_id);

        String locationValue = (product.getLocation() == null || product.getLocation().isEmpty()) ? null : product.getLocation();

        Product productnew = Product.builder()
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .status(product.getStatus())
                .category(category)
                .location(locationValue)
                .user(user_id)
                .fileList(product.getFileList())
                .build();

        Product sProduct = productRepository.save(productnew);
        Long productId = sProduct.getId();
        addFiles(files, productId);
        return sProduct;
    }


    // ProductService에서 Product를 조회하는 메서드 추가
    public Product findProductById(Long id) {
        // Product를 id로 조회하는 코드를 작성하여 반환
        System.out.println("id = " + id);
        return productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("product_id를 못찾아요"));
    }


    private void addFiles(List<MultipartFile> files, Long productId) {
        System.out.printf(files.toString());
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
        File file = new File(uploadDir+"/product", originName);
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
        Path copyOfLocation = Paths.get(new File(uploadDir+"/product", photoName).getAbsolutePath());
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
        Product product = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Product with id " + id + " not found"));

        // 상품 이미지 정보 조회
        List<ProductImage> productImages = productImageRepository.findByProductId(id);

        // ProductDTO 변환 (기존 로직 유지하며 상품 이미지 정보 추가)
        ProductDTO productDTO = ProductDTO.toDto(product);

        // ProductDTO에 상품 이미지 정보 설정
        // 이 부분은 ProductDTO 내에 List<ProductImageDTO> 또는 비슷한 필드가 정의되어 있어야 합니다.
        // ProductImageDTO는 ProductImage 엔티티를 DTO로 변환하는 클래스입니다. 필요에 따라 구현해야 합니다.
        List<ProductImageDTO> productImageDTOs = productImages.stream()
                .map(ProductImageDTO::toDto)
                .collect(Collectors.toList());

        productDTO.setFileList(productImageDTOs); // 상품 이미지 정보를 DTO에 설정

        return productDTO;
    }

    // 수정
//    @Transactional
//    public ProductDTO update(ProductDTO product, List<MultipartFile> files, Long[] delfile) {
//        System.out.println(product.toString());
//
//        Product productEntity = productRepository.findById(product.getId()).orElse(null);
////        Category category = categoryRepository.findById(product.getCategory().getId()).orElse(null);
//
//        String main = product.getCategory().getMain();
//        String sub = product.getCategory().getSub();
//        Category category = categoryRepository.findUnique(main, sub);
//        User user_id = userRepository.findById(product.getUser_id()).orElse(null);
//        System.out.println("update product user_id : " + user_id);
//
//        if (category != null) {
//            category.setMain(product.getCategory().getMain());
//            category.setSub(product.getCategory().getSub());
//
//            categoryRepository.save(category);
//
//            productEntity.setLocation(product.getLocation());   // 위치
//            productEntity.setTitle(product.getTitle());
//            productEntity.setPrice(product.getPrice());
//            productEntity.setStatus(product.getStatus());
//            productEntity.setDescription(product.getDescription());
//            productEntity.setCategory(category);
//            productEntity.setRefreshedAt(product.getRefreshedAt());  // 끌어올리기
////            productRepository.save(productEntity);
//
//            Product sProduct = productRepository.save(productEntity);
//            Long productId = sProduct.getId();
//            addFiles(files, productId);
//
//            // 삭제할 첨부파일(들) 삭제
//            if(delfile != null){
//                for(Long fileId : delfile){
//                    ProductImage file = productImageRepository.findById(Math.toIntExact(fileId)).orElse(null);
//                    if(file != null){
//                        delFile(file);   // 물리적으로 파일 삭제
//                        // DB 에서 삭제
//                        productImageRepository.delete(file);
//                    }
//                }
//                System.out.println(" ======== 삭제 진행 ");
//            }
//        }
//        return ProductDTO.toDto(productEntity);
//    }
    @Transactional
    public Product update(ProductsDTO product, List<MultipartFile> files, Long[] delfile) {
        // 업데이트할 제품 정보 가져오기
        Product productEntity = productRepository.findById(product.getId()).orElse(null);
        System.out.println("productEntity = " + productEntity);
        if (productEntity == null) {
            // 업데이트할 제품이 없으면 null 반환
            return null;
        }

        // 업데이트할 카테고리 정보 가져오기
        Category category = categoryRepository.findUnique(product.getCategoryMain(), product.getCategorySub());
        if (category != null) {
            // 카테고리 정보가 유효한 경우에만 업데이트 수행
            category.setMain(product.getCategoryMain());
            category.setSub(product.getCategorySub());
            categoryRepository.save(category);
            System.out.println("category = " + category);
        }

        // 업데이트할 사용자 정보 가져오기
        User user_id = userRepository.findById(product.getUser_id()).orElse(null);
        System.out.println("user_id = " + user_id);

        // 위치 정보 설정
        String locationValue = (product.getLocation() == null || product.getLocation().isEmpty()) ? null : product.getLocation();

        // 제품 필드 업데이트
        productEntity.setTitle(product.getTitle());
        productEntity.setDescription(product.getDescription());
        productEntity.setPrice(product.getPrice());
        productEntity.setStatus(product.getStatus());
        productEntity.setCategory(category);
        productEntity.setLocation(locationValue);
        productEntity.setUser(user_id);
        productEntity.setRefreshedAt(product.getRefreshed_at());

        // 제품 엔터티 저장
        Product updatedProduct = productRepository.save(productEntity);
        System.out.println("updatedProduct = " + updatedProduct);
        Long productId = updatedProduct.getId();

        // 새로운 첨부 파일 추가
        addFiles(files, productId);

        // 삭제할 첨부 파일 삭제
        if (delfile != null) {
            for (Long fileId : delfile) {
                ProductImage file = productImageRepository.findById(Math.toIntExact(fileId)).orElse(null);
                System.out.println("file = " + file);
                if (file != null) {
                    delFile(file); // 물리적으로 파일 삭제
                    // DB 에서 삭제
                    productImageRepository.delete(file);
                }
            }
            System.out.println(" ======== 삭제 진행 ");
        }
        System.out.println("ProductService.update");
        // 업데이트된 제품 반환
        return updatedProduct;
    }

    // 특정 첨부파일(id) 를 물리적으로 삭제
    private void delFile(ProductImage file) {
        String saveDirectory = new File(uploadDir+"/product").getAbsolutePath();
        System.out.println("saveDirectory = " + saveDirectory);
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
        List<ProductImage> fileList = productImageRepository.findByProductId(id);
        if (fileList != null && fileList.size() > 0){
            for (ProductImage file : fileList) {
                delFile(file);
            }
            System.out.println("ProductService.delete 실행");
        }
        // 글 삭제
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