import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import GoogleMaps from './GoogleMaps';

const UpdatePage = () => {

  let {id} = useParams();

  const navigate = useNavigate();

  const location = useLocation();
  const [selectedLocation, setSelectedLocation] = useState(""); // 기본 선택

   // GoogleMaps 활성여부
   const [showGoogleMaps, setShowGoogleMaps] = useState(false);

  useEffect(() => {
    if (location.state && location.state.location) {
      const{lat, lng} = location.state.location;
      setSelectedLocation(`${lat}, ${lng}`);
      console.log("위경도: " + setSelectedLocation(`${lat}, ${lng}`)); // 위도, 경도형식으로 문자열 저장
    }
  }, [location.state]);
  
  const [product, setProduct] = useState({
    title:"",
    description:"",
    price:0,
    status:"",
    middleCategory:"",
    // 카테고리는 object
    // category:{
      //   id:"",
      //   name:""
    // },
    refreshedAt:"",
    location: ""
  });
  
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  
  const pc = {
    ...product,
    category: selectCategory
  };
  
  // 위치
  useEffect(() => {
    setProduct((prevProduct) => ({
      ...prevProduct, 
      location: selectedLocation  // 선택된 위치 업데이트
    }));
    console.log('::' + selectedLocation);
  }, [selectedLocation]);
  
  const toggleGoogleMaps = () => {
    setShowGoogleMaps(prevState => !prevState); // GoogleMaps의 표시 여부를 토글
  };

  const UpdateValue = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
    console.log(e.target.value);
    console.log(product);
  }


  // 대분류 카테고리만
  const CategoryValue = (e) => {
    setProduct({
      ...product,
      category: {
        id:e.target.value,
        name:e.target.options[e.target.selectedIndex].text  // select 안 option들 중에서 선택된 option에 해당하는 text 가져오기
      },
    });
    console.log(product);
  }

  // 선택된 category 값
  // const CategoryValue = (e) => {
  //   setSelectCategory(e.target.value);
  //   console.log("category " + e.target.value);
  // }


  // 카테고리
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product/category`)
    .then(response => response.json())
    .then(data => {
      setCategories(data);
    });
  }, []);

  // 지도
  const MapOk = () => {
    navigate("/product/map/"+id);
  }

  // 끌어올리기
  const refreshedAtValue = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}T${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}.${currentDate.getMilliseconds().toString().padStart(3, '0')}`; // 현재시간을 문자열로 변환
    console.log(formattedDate);
    setProduct({
      ...product,
      refreshedAt: formattedDate
    }); // 상태 업데이트
  }
  
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product/detail/` + id)
    .then(response => response.json())
    .then(data => setProduct(data));
  }, []);

  const UpdateOk = (e) =>{
    e.preventDefault();
    console.log(product);

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product/update`, {
      method:"PUT",
      headers: {
        "Content-Type": "application/json;charset-utf-8",
      },
      body: JSON.stringify(pc),
    })
    .then(response => {
      if(response.status === 200){
        console.log(`수정되나`, response);
        return response.json();
      } else{
        return null;
      }
    })
    .then(data => {
      if(data !== null){
        alert('수정 완료');
        navigate(`/product/detail/${id}`);
      } else {
        alert('수정 실패');
      }
    })
  }

  return (
    <div>
      {/* <GoogleMaps props={id}></GoogleMaps> */}
      <h2>상품 수정</h2>
      <span>이미지 첨부</span>
      <div className="mb-3">
        <input type="file" name='productImage' />
      </div>
      <span>위치</span>
      {/* {selectedLocation && (
      <div className="mb-3">
        <Button variant="outline-dark" onClick={MapOk}>위치 선택</Button>
        <span>선택된 위치 Lat:{selectedLocation.lat} Lng: {selectedLocation.lng}</span>
      </div>
      )} */}

<button onClick={toggleGoogleMaps}>
        {showGoogleMaps ? 'GoogleMaps 숨기기' : 'GoogleMaps 표시하기'}
      </button>

      {/* GoogleMaps 컴포넌트를 props와 함께 조건부 렌더링 */}
      {showGoogleMaps && (
        <GoogleMaps
          props={{
            // 여기에 원하는 props를 전달할 수 있습니다.
            key: 'value',
            anotherProp: 'anotherValue',
          }}
        />
      )}

      {/* <input type="button" name="location" id="location" value={product.location} onClick={MapOk}></input><br/> */}
      <span>제목</span>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          name="title"
          id='title'
          placeholder="제목을 입력하세요"
          value={product.title}
          onChange={UpdateValue}
        />
      </div>
      {/* 선택된 값 가져오기 */}
      <div>
        <span>대분류</span>
        <div className="">
        <select className="form-select" name="category" value={selectCategory.id} onChange={CategoryValue}>
            <option>-- 대분류 카테고리를 선택해주세요 --</option>
          {categories.map(category =>
          ( 
            <option key={category.id} value={category.id}>{category.name}</option>)
          )}</select>
        {/* <select className="form-select" name='category' value={product.category.id} onChange={categoryValue}>
            <option value="null">-- 대분류 카테고리를 선택해주세요 --</option>
            <option value="1">의류</option>
            <option value="2">식품</option>
            <option value="3">생활용품</option>
            <option value="4">잡화</option>
            <option value="5">가구/인테리어</option>
            <option value="6">가전</option>
            <option value="7">도서</option>
            <option value="8">기타</option>
          </select> */}
          <span>중분류</span>
          {/* <select className="form-select" name='middleCategory' value={product.middleCategory} onChange={UpdateValue}> */}
            {/* {product.category.id === 'null' && (
              <><option value="null" selected>-- 대분류 먼저 선택해주세요 --</option></>
            )}
            {product.category.id === '1' && (
            <><option value disabled selected>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="여성의류">여성의류</option> 
            <option value="남성의류">남성의류</option>
            <option value="아동의류">아동의류</option></>)}
            {product.category.id === '2' && (
            <><option value disabled selected>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="가공식품">가공식품</option>
            <option value="기타식품">기타식품</option>
            </>)}
            {product.category.id === '3' && (
            <><option disabled selected>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="주방용품">주방용품</option>
            <option value="욕실용품">욕실용품</option></>)}
            {product.category.id === '4' && (
            <><option disabled selected>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="남성잡화">남성잡화</option>
            <option value="여성잡화">여성잡화</option>
            <option value="아동잡화">아동잡화</option>
            <option value="반려동물용품">반려동물용품</option></>)}
            {product.category === '5' && (
            <><option disabled selected>-- 중분류 카테고리를 선택해주세요 --</option>
            <option value="가구">가구</option>
            <option value="인테리어">인테리어</option></>)}
            {product.category.id === '6' && (
            <><option disabled selected>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="디지털기기">디지털기기</option>
            <option value="주방가전">주방가전</option>
            <option value="리빙가전">리빙가전</option></>)}
            {product.category.id === '7' && (
            <><option disabled selected>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="도서">도서</option>
            <option value="유아도서">유아도서</option></>)}
            {product.category.id === '8' && (
            <><option disabled selected>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="기타">기타</option></>)}
          </select> */}
          <select className='form-select' name='middleCategory' value={product.middleCategory} onChange={UpdateValue}>
            <option value="여성의류">여성의류</option>
            <option value="남성의류">남성의류</option>
            <option value="아동의류">아동의류</option>
          </select>
        </div>
      </div>

      <span>가격</span>
      <div className="">
        <input type="number" className="form-control" name='price' id='price' value={product.price} placeholder="가격을 입력하세요" onChange={UpdateValue}/>
      </div> 
      <span>설명</span>
      <div className="">
        <textarea cols='90' rows='10' name='description' value={product.description} placeholder="게시글 내용을 작성해주세요. 가품 및 판매금지품목은 게시가 제한될 수 있어요" onChange={UpdateValue}/>
      </div>
      <span>상태</span>
      <div>
        <select className="form-select" name='status' value={product.status} onChange={UpdateValue}>
        <option disabled selected> -- 판매 상태를 선택해주세요 -- </option>
          <option value="SALE">판매중</option>
          <option value="RESERVED">예약중</option>
          <option value="SOLD">판매완료</option>
        </select>
      </div>
      <div className=''>
        <Button variant='outline-dark' name='refreshedAt' onClick={refreshedAtValue}>끌어올리기</Button>
        <span>끌어올린 시간 : {product.refreshedAt}</span>
      </div>
      <Button variant='outline-dark me-2' onClick={UpdateOk}>완료</Button>
      <Button variant='outline-dark' onClick={() => navigate(-1)}>이전으로</Button>
    </div>
  );
};

export default UpdatePage;