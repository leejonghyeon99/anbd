import React, { useState, useEffect } from 'react';
import styles from '../css/category.module.css'
const Category = ({setModalToggle}) => {



    const apiUrl = process.env.REACT_APP_API_BASE_URL;



    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [categoryToggle, setCategoryToggle] = useState("");
    const [parentInputValue, setParentInputValue] = useState("");
    const [childInputValue, setChildInputValue] = useState("");    
    const [validParent, setValidParent] = useState(null);
    const [validChild, setValidChild] = useState(null);
    const [updateSub, setUpdateSub] = useState("");
    const [selectCategory, setSelectCategory] = useState({
        id : "",
        main : "",
        sub : "",
    });


    const [activeParent, setActiveParent] = useState(false);


    const allReset = () => {
        setCategories([]);
        setActiveCategory(null);
        setCategoryToggle("");
        setParentInputValue("");
        setChildInputValue("");
        setSelectCategory(null);
        setValidParent("");
        setValidChild("");
        setActiveParent(false);
    }


    const transformData = (data) => {
        return Object.values(data.reduce((acc, currentItem) => {
            const { main, sub } = currentItem;
            if (!acc[main]) {
              acc[main] = { main, sub: [sub] };
            } else {
              acc[main].sub.push(sub);
            }
            return acc;
          }, []))
      };


    const categoryList = async () => {
        try {
            const url = `${apiUrl}/api/admin/product/category/list`;
            const response = await fetch(url);
            const data = await response.json();
            setCategories(transformData(data))
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        categoryList();
    }, []);



    const selectUpdateValue = (e) => {
        setSelectCategory({
            ...selectCategory,
            [e.target.name] : e.target.value
        })
    }

    const handleCategoryClick = (m) => {
        setSelectCategory({
            ...selectCategory,
            main : m.main,
            sub : '',
        })
        setActiveCategory(m.main);
        setParentInputValue(m.main);
        
        setActiveParent(true);
        setCategoryToggle('manage')
        if(!activeParent){
            setChildInputValue('');
        }
    };

    const handleSubSelect = (m, s) => {
        setActiveCategory(s);
        setSelectCategory({main : m, sub: s});
        setActiveParent(false);
        setCategoryToggle('update')
    }

    const selectCategoryToggle = (value) => {
        setCategoryToggle(value);
        setParentInputValue('');
        setChildInputValue('');
        setActiveCategory('');
    };

    const validation = (value, check) => {
        
         if(check === 'parent'){
                // 값이 null 또는 undefined 인 경우
            if (value == null) {
                setValidParent('문자를 입력하세요');
                return false;
            }

            // 값이 공백 또는 빈 문자열인 경우
            if (typeof value === 'string' && value.trim() === '') {
                setValidParent('문자를 입력하세요');
                return false;
            }

            // 특수문자를 포함하는지 여부를 정규식을 사용하여 검증
            const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
            if (specialCharacterRegex.test(value)) {
                setValidParent('특수문자는 입력이 불가능합니다.');
                return false;
            }

            if(categories.some(obj => obj.main === value)){
                setValidParent('이미 존재하는 카테고리 입니다.');
                return false;
            }

            if(categories.some(obj => obj.sub.some(sub => sub === value))){
                setValidParent('이미 존재하는 카테고리 입니다.');
                return false;
            }
         }

         if(check === 'child'){
                // 값이 null 또는 undefined 인 경우
            if (value == null) {
                setValidChild('문자를 입력하세요');
                return false;
            }

            // 값이 공백 또는 빈 문자열인 경우
            if (typeof value === 'string' && value.trim() === '') {
                setValidChild('문자를 입력하세요');
                return false;
            }

            // 특수문자를 포함하는지 여부를 정규식을 사용하여 검증
            const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
            if (specialCharacterRegex.test(value)) {
                setValidChild('특수문자는 입력이 불가능합니다.');
                return false;
            }

            if(categories.some(obj => obj.main === value)){
                setValidChild('이미 존재하는 카테고리 입니다.');
                return false;
            }

            if(categories.some(obj => obj.sub.some(sub => sub === value))){
                setValidChild('이미 존재하는 카테고리 입니다.');
                return false;
            }
         }
      
        // 모든 검증 통과
        return true;
    }


    //메인 카테고리 추가
    const createCategory = async () => {
      if(validation(parentInputValue, 'parent') && validation(childInputValue, 'child')){
            try {
                const url = `${apiUrl}/api/admin/product/category`;
  
                const option = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    
                    body: JSON.stringify({main : parentInputValue, sub : childInputValue}),
                };
    
                const response = await fetch(url,option);        
                const data = await response.json();
    
                if(data.resultCode === 'success'){
                    console.log(data.result)                    
                    setCategories(transformData(data.result));
                    setParentInputValue('');
                    setChildInputValue('');
                }
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };
    
    const handleAddCategoryBtn = () => {     
        createCategory();
    }
    

    const handleSubCategoryUpdate = async () => {
        console.log(selectCategory, updateSub)
        try {
            const url = `${apiUrl}/api/admin/product/category/child`;

            const option = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },                
                body: JSON.stringify({
                    main: selectCategory.main,
                    sub: selectCategory.sub,
                    change: updateSub
                  })
            };

            const response = await fetch(url,option);        
            const data = await response.json(); 
            if(data.resultCode === 'success'){
                categoryList();
                setSelectCategory('')
                setUpdateSub('');          
                
            }
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    
    }

    //특정 카테고리 삭제
    const handleCategoryDelete = async () => {
     
        if(window.confirm("정말로 삭제하시겠습니까?")){
            try {
                const url = `${apiUrl}/api/admin/product/category/child`;
    
                const option = {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },                
                    body: JSON.stringify({
                        main: selectCategory.main,
                        sub: selectCategory.sub,
                      })
                };
    
                const response = await fetch(url,option);        
                const data = await response.json(); 
                if(data.resultCode === 'success'){
                    categoryList();
                    setSelectCategory({...selectCategory, sub : updateSub})
                }
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        
        }
        
    }


    //특정 메인의 하위 서브 추가
    const createSubCategory = async () => {
        if(validation(selectCategory.sub, 'child')){
            try {
                const url = `${apiUrl}/api/admin/product/category/child`;
    
                const option = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    
                    body: JSON.stringify(selectCategory),
                };
    
                const response = await fetch(url,option);        
                const data = await response.json();
    
                if(data.resultCode === 'success'){
                    console.log(data.result)                    
                    setCategories(transformData(data.result));
                    setParentInputValue('');
                }
                
            } catch (error) {
                setSelectCategory(null);
                console.error('Error fetching data:', error);
            }
        }

    };

 
    const txt = [
        "띄워쓰기는 불가능합니다",
        "카테고리는 중복 될 수 없습니다.",
        "카테고리는 공백 또는 빈문자는 작성 하실 수 없습니다.",
        "카테고리는 특수문자 사용 불가능합니다.",
        "상위카테고리는 하위카테고리를 1개이상 가져야 합니다."
    ];
    useEffect(()=>{console.log(selectCategory);},[selectCategory])

    return (
            <div className={`${styles.container}`}>
            <div className={`${styles.header}`}>
                <span className={`${styles.cancleBtn} ${styles.addPointer}`} onClick={() => {setModalToggle(false); allReset()}}>취소</span>   
            </div>
            
            <div className={`${styles.content}`}>
                <button
                    type='button'                 
                    className={`${styles.addBtn} ${styles.addPointer}`}
                    onClick={() => {selectCategoryToggle("create"); setValidParent(null); setValidChild(null)}}
                >
                    + 상위 카테고리 추가
                </button>
                <div className={`${styles.categoryList}`}>                
                        {categories.map((m) => (
                            <>
                                <div
                                    key={m.id}
                                    name='main'
                                    className={`${styles.category} ${m.main === activeCategory ? styles.active : ''}`}
                                    onClick={() => {handleCategoryClick(m); setUpdateSub('')}}                            
                                    >                            
                                    {m.main}                                                       
                                </div>
                                {m.sub.map((s) => (
                                   <div                                        
                                        name='sub'
                                        className={`${styles.sub} ${s === activeCategory ? styles.subActive : ''}`}        
                                        onClick={() => {handleSubSelect(m.main, s); setUpdateSub('')}}
                                        >                            
                                        {s}                                                           
                                    </div>    
                                ))}
                            </>     
                        ))}
                </div>
                <div className={`${styles.categoryWrite}`}>
                    
                    {categoryToggle === 'create' && 
                        <>
                            <div className={`${styles.categoryNameBox}`}>
                                <div>
                                    <label htmlFor="categoryInputP">상위 카테고리 명</label>
                                    <div id='categoryInputP' className={`${styles.categoryName} ${styles.focusWithin}`}>
                                        <input 
                                            type='text' 
                                            placeholder='대 분류'
                                            value={parentInputValue}  
                                            onChange={(e) => setParentInputValue(e.target.value)}
                                            onFocus={()=>{setValidParent('')}}
                                        />
                                    </div>
                                </div>
                                {validParent && <div className={`${styles.valid}`}>{validParent}</div>}
                                <br></br>
                                <div>
                                    <label htmlFor="categoryInputC">하위 카테고리 명</label>
                                    <div id='categoryInputC' className={`${styles.categoryName} ${styles.focusWithin}`}>
                                        <input 
                                            type='text' 
                                            placeholder='중 분류'
                                            value={childInputValue}  
                                            onChange={(e) => setChildInputValue(e.target.value)}
                                            onFocus={()=>{setValidChild('')}}
                                        />
                                    </div>                                
                                </div>
                                {validChild && <div className={`${styles.valid}`}>{validChild}</div>}    
                                <button 
                                    type='button' 
                                    className={`${styles.addCategoryBtn}`}
                                    onClick={handleAddCategoryBtn}                                
                                >
                                    추가
                                </button>
                            </div>                    
                            
                        </>
                    }
                   

                   {categoryToggle === 'manage' && 
                        <>                      
                            <div className={`${styles.categoryNameBox}`}>
                                <label htmlFor="categoryInput">선택된 상위 카테고리 {selectCategory.main}</label>
                                <div id='categoryInput' className={`${styles.categoryName} ${styles.focusWithin}`}>
                                    <input                                     
                                        name="sub"
                                        type='text' 
                                        placeholder='중분류 이름 입력' 
                                        value={selectCategory ? selectCategory.sub : ''} 
                                        onChange={(e) => selectUpdateValue(e)}    
                                        onFocus={()=>{setValidChild('')}}                                                                  
                                    />
                                </div>
                                {selectCategory && 
                                (<div className={`${styles.updateInnerBtn}`}>
                                    <button 
                                        type='button' 

                                        onClick={createSubCategory}                                
                                    >
                                        중분류 추가
                                    </button>

                                </div>)
                                }
                            </div>
                            {validChild && <div className={`${styles.valid}`}>{validChild}</div>}    
                        </>
                    }               


                    {categoryToggle === 'update' && 
                        <>
                            <div className={`${styles.categoryNameBox}`}>
                                <label htmlFor="categoryInput">선택된 중분류</label>
                                <div id='categoryInput' className={`${styles.categoryName} ${styles.focusWithin}`}>
                                    <input                                     
                                        name="sub"
                                        type='text' 
                                        placeholder='선택하세요' 
                                        value={selectCategory.sub} 
                                        onChange={(e) => selectUpdateValue(e)}           
                                        disabled                                                            
                                    />
                                </div>
                                <div id='categoryInput' className={`${styles.categoryName} ${styles.focusWithin} ${styles.updateSub}`}>
                                    <input                                     
                                        name="sub"
                                        type='text' 
                                        placeholder='변경할 이름' 
                                        value={updateSub ? updateSub : ''} 
                                        onChange={(e) => setUpdateSub(e.target.value)}                                                               
                                    />
                                </div>

                                {selectCategory && 
                                (<div className={`${styles.updateInnerBtn}`}>
                                    <button 
                                        type='button' 

                                        onClick={handleSubCategoryUpdate}                                
                                    >
                                        변경
                                    </button>

                                    <button 
                                        type='button' 

                                        onClick={handleCategoryDelete}                                
                                    >
                                        삭제
                                    </button>
                                </div>)
                                }
                            </div>
                            {validChild && <div className={`${styles.valid}`}>{validChild}</div>}    
                        </>
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