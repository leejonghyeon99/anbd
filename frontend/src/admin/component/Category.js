import React, { useState, useEffect } from 'react';
import styles from '../css/category.module.css'
const Category = ({setModalToggle}) => {



    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [categoryToggle, setCategoryToggle] = useState("");
    const [categoryInputValue, setCategoryInputValue] = useState("");
    const [selectCategory, setSelectCategory] = useState(null);
    const [valid, setValid] = useState("");
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

    const handleCategoryClick = (m) => {
        setActiveCategory(m.id);
        setSelectCategory(m);
    };

    const selectCategoryToggle = (value) => {
        setCategoryToggle(value);
        setCategoryInputValue('');
        setActiveCategory('');
        setSelectCategory(null);
    };

    const validation = (value) => {
        // 값이 null 또는 undefined 인 경우
        if (value == null) {
            setValid('문자를 입력하세요');
            return false;
        }

        // 값이 공백 또는 빈 문자열인 경우
        if (typeof value === 'string' && value.trim() === '') {
            setValid('문자를 입력하세요');
            return false;
        }

        // 특수문자를 포함하는지 여부를 정규식을 사용하여 검증
        const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharacterRegex.test(value)) {
            setValid('특수문자는 입력이 불가능합니다.');
            return false;
        }

        if(categories.some(obj => obj.name === value)){
            setValid('이미 존재하는 카테고리 입니다.');
            return false;
        }

        // 모든 검증 통과
        return true;
    }


    const createCategory = async () => {
        if(validation(categoryInputValue)){
            try {
                const url = `${apiUrl}/api/admin/product/category`;
    
                const option = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
    
                    body: JSON.stringify({"name" : categoryInputValue}),
                };
    
                const response = await fetch(url,option);        
                const data = await response.json();
    
                if(data.resultCode === 'success'){
                    console.log(data.result)
                    setCategories(data.result);
                    setCategoryInputValue('');
                }
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    const handleAddCategoryBtn = () => {        
        createCategory();
    }

    const handleAddCategoryEnter = (e) => {
        if (e.key === 'Enter') {
            createCategory();
        }
    ;}

    const selectUpdateValue = (e) =>{
        setSelectCategory({
            ...selectCategory,
            [e.target.name]: e.target.value.trim(),
          })
    }

    const handleCategoryUpdate = () => {
        const updateCategory = async () => {
            try {
                const url = `${apiUrl}/api/admin/product/category`;
    
                const option = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
    
                    body: JSON.stringify(selectCategory),
                };
    
                const response = await fetch(url,option);        
                const data = await response.json();
    
                if(data.resultCode === 'success'){
                    window.alert(selectCategory.name + ' 카테고리가 변경되었습니다.');
                    setCategories(data.result);
                }
                
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        if(validation(selectCategory.name)){
            console.log(selectCategory.name);
            updateCategory();
            setSelectCategory(null);
        }


    }
    const handleCategoryDelete = () => {
        const deleteCategory = async () => {
            try {
                const url = `${apiUrl}/api/admin/product/category`;
    
                const option = {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
    
                    body: JSON.stringify(selectCategory.id),
                };
    
                const response = await fetch(url,option);        
                const data = await response.json();
    
                console.log(data)
                if(data.resultCode === 'success'){
                    window.alert(selectCategory.name + ' 카테고리가 삭제 되었습니다.');
                    setCategories(data.result);
                    setSelectCategory(null);
                }
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        deleteCategory();
        
    }
useEffect(() => {console.log(selectCategory);},[selectCategory])
   

    const txt = [
        "띄워쓰기는 불가능합니다",
        "카테고리는 중복 될 수 없습니다.",
        "카테고리는 공백 또는 빈문자는 작성 하실 수 없습니다.",
        "카테고리는 특수문자 사용 불가능합니다.",
    ];

    return (
            <div className={`${styles.container}`}>
            <div className={`${styles.header}`}>
                <div className={`${styles.addBtnWrap}`}>                             
                    <button
                        type='button'                 
                        className={`${styles.addBtn} ${styles.addPointer}`}
                        onClick={() => {selectCategoryToggle("create"); setValid(null)}}
                    >
                        추가
                    </button>
                    <button   
                        type='button'               
                        className={`${styles.addBtn} ${styles.addPointer}`}
                        onClick={() => {selectCategoryToggle("update"); setValid(null)}}
                    >
                        수정
                    </button>
                    <button           
                        type='button'       
                        className={`${styles.addBtn} ${styles.addPointer}`}
                        onClick={() => selectCategoryToggle("delete")}
                    >
                        삭제
                    </button>
                </div>
                <span className={`${styles.cancleBtn} ${styles.addPointer}`} onClick={() => setModalToggle(false)}>취소</span>   
            </div>
            
            <div className={`${styles.content}`}>
                <div className={`${styles.categoryList}`}>
                        {categories.map((m) => (
                            <div
                                key={m.id}
                                className={`${styles.category} ${m.id === activeCategory ? styles.active : ''}`}
                                onClick={() => handleCategoryClick(m)}                            
                                >                            
                                {m.name}                                
                            </div>
                        ))}
                </div>
                <div className={`${styles.categoryWrite}`}>
                    
                    {categoryToggle === 'create' && 
                        <>
                            <div className={`${styles.categoryNameBox}`}>
                                <label htmlFor="categoryInput">카테고리 명</label>
                                <div id='categoryInput' className={`${styles.categoryName} ${styles.focusWithin}`}>
                                    <input 
                                        type='text' 
                                        placeholder='새 카테고리' 
                                        value={categoryInputValue}  
                                        onChange={(e) => setCategoryInputValue(e.target.value)}
                                        onKeyUp={handleAddCategoryEnter}
                                    />
                                </div>
                                <button 
                                    type='button' 
                                    className={`${styles.addCategoryBtn}`}
                                    onClick={handleAddCategoryBtn}                                
                                >
                                    추가
                                </button>
                            </div>                    
                            {valid && <div className={`${styles.valid}`}>{valid}</div>}
                        </>
                    }
                   
                    {categoryToggle === 'update' && 
                        <>
                            <div className={`${styles.categoryNameBox}`}>
                                <label htmlFor="categoryInput">선택된 카테고리</label>
                                <div id='categoryInput' className={`${styles.categoryName} ${styles.focusWithin}`}>
                                    <input                                     
                                        name="name"
                                        type='text' 
                                        placeholder='선택하세요' 
                                        value={selectCategory ? selectCategory.name : ''} 
                                        onChange={(e) => selectUpdateValue(e)}
                                        disabled={!selectCategory}                                                                        
                                    />
                                </div>
                                {selectCategory && 
                                    <button 
                                        type='button' 
                                        className={`${styles.addCategoryBtn}`}
                                        onClick={handleCategoryUpdate}                                
                                    >
                                        수정
                                    </button>
                                }
                            </div>
                            {valid && <div className={`${styles.valid}`}>{valid}</div>}
                        </>
                    }
                    {categoryToggle === 'delete' && 
                        <div className={`${styles.categoryNameBox}`}>
                            <label htmlFor="categoryInput">선택된 카테고리</label>
                            <div id='categoryInput' className={`${styles.categoryName} ${styles.focusWithin}`}>
                                <input 
                                    type='text' 
                                    placeholder='선택하세요' 
                                    value={selectCategory ? selectCategory.name : ''}           
                                    disabled
                                />
                            </div>
                            <button 
                                type='button' 
                                className={`${styles.addCategoryBtn}`}
                                onClick={handleCategoryDelete}                                
                            >
                                삭제
                            </button>
                        </div>
                    }
                    <div className={`${styles.txt}`}>
                        <h3>설명</h3>

                        {txt.map(m => <p key={m.id}>{m}</p>)}
                    </div>

                </div>
            </div>
        </div>
    );
};


export default Category;