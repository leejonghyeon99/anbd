package com.lec.spring.repository;

import com.lec.spring.domain.Category;
import com.lec.spring.dto.CategoryDTO;
import com.lec.spring.dto.category.MainCategoryDTO;
import com.lec.spring.dto.category.SubCategoryDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    Optional<Category> findByMain(String main);
    Optional<Category> findBySub(String sub);

    @Query("select c from Category c where c.main= :main and c.sub = :sub")
    Category findUnique(String main, String sub);

    @Query("select c from Category c where c.main = :main group by c.main, c.sub ")
    Optional<List<Category>> findAllGroupMain(String main);

    @Query("select c as main from Category c group by c.main ")
    Optional<List<Category>> findAllOnlyMain();

    @Query("select c from Category c group by c.sub ")
    Optional<List<Category>> findAllOnlySub();
}
