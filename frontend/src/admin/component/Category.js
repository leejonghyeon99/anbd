import React, { useState, useEffect } from 'react';
import styles from '../css/category.module.css'
const Category = () => {


    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);

    
  
    useEffect(() => {
        const userList = async () => {
            try {
                const url = `${apiUrl}/api/admin/product/category/list`;
                const response = await fetch(url);
                const data = await response.json();
                
                setCategories(data)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        userList();
    }, []);

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(categoryId);
    };

    return (
        <div className={`${styles.container}`}>
            <div className={`${styles.header}`}>
                <div className={`${styles.addBtnWrap}`}>
                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                    <span className={`${styles.addBtn} ${styles.addPointer}`}>카테고리 추가</span>
                </div>
                <div className={`${styles.saveAndCancle}`}>
                    <span className={`${styles.cancleBtn} ${styles.addPointer}`}>취소</span>
                    <span className={`${styles.saveBtn} ${styles.addPointer}`}>저장</span>
                </div>            
            </div>
            
            <div className={`${styles.content}`}>
                <div className={`${styles.categoryList}`}>
                    {categories.map((m) => (
                        <div
                            key={m.id}
                            className={`${styles.category} ${m.id === activeCategory ? styles.active : ''}`}
                            onClick={() => handleCategoryClick(m.id)}
                            >
                            {m.name}
                        </div>
                    ))}
                </div>
                <div className={`${styles.categoryWrite}`}></div>
            </div>

            {/* <ul className=''>
                {categories.map((category) => (
                    <li key={category.id}>{category.name}</li>
                ))}
            </ul> */}

        </div>
    );
};


export default Category;