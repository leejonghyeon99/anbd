package com.lec.spring.repository;

import com.lec.spring.domain.Category;
import com.lec.spring.dto.CategoryDTO;
import com.lec.spring.dto.category.MainCategoryDTO;
import com.lec.spring.dto.category.SubCategoryDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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

    @Query("select distinct c.main from Category c")
    Optional<List<String>> findAllOnlyMain();

    @Query("select c from Category c")
    Optional<List<Category>> findAllOnlySub();

    @Modifying
    @Query("delete from Category c where c.main = :main and c.sub=:sub")
    void deleteSub(String main, String sub);

    @Modifying
    @Query("update Category c set c.sub=:change where c.main = :main and c.sub=:sub")
    void updateSub(String change, String main, String sub);
}
