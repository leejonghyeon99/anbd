import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const UpdatePage = () => {

  let {id} = useParams();

  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title:"",
    description:"",
    price:0,
    status:"",
    middleCategory:"",
    // 카테고리는 object
    category:{
      id:"",
      name:""
    }
  });
  
  const UpdateValue = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
    console.log(e.target.value);
    console.log(product);
  }

  // 대분류 카테고리만 
  const categoryValue = (e) => {
    setProduct({
      ...product,
      category: {
        id:e.target.value,
        name:e.target.options[e.target.selectedIndex].text  // select 안 option들 중에서 선택된 option에 해당하는 text 가져오기
      },
    });
    console.log(product);
  }

  useEffect(() => {
    fetch("http://localhost:8080/api/product/detail/" + id)
    .then(response => response.json())
    .then(data => setProduct(data));
  }, []);

  const UpdateOk = (e) =>{
    e.preventDefault();
    console.log(product);

    fetch("http://localhost:8080/api/product/update", {
      method:"PUT",
      headers: {
        "Content-Type": "application/json;charset-utf-8",
      },
      body: JSON.stringify(product),
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
      <h2>상품 수정</h2>
      <span>이미지 첨부</span>
      <div className="mb-3">
        <input type="file" name='productImage' />
      </div>
      <span>위치</span>
      <div className="mb-3">
        <Button variant='outline-dark' name='location'>위치찾기</Button>
      </div>
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
        <div className="mb-3">
        <select className="form-select" name='category' value={product.category.id} onChange={categoryValue}>
            <option value="null">-- 대분류 카테고리를 선택해주세요 --</option>
            <option value="1">의류</option>
            <option value="2">식품</option>
            <option value="3">생활용품</option>
            <option value="4">잡화</option>
            <option value="5">가구/인테리어</option>
            <option value="6">가전</option>
            <option value="7">도서</option>
            <option value="8">기타</option>
          </select>
          <span>중분류</span>
          <select className="form-select" name='middleCategory' value={product.middleCategory} onChange={UpdateValue}>
            {product.category.id === 'null' && (
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
            <><option isabled selected>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="주방용품">주방용품</option>
            <option value="욕실용품">욕실용품</option></>)}
            {product.category.id === '4' && (
            <><option disabled selected>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="남성잡화">남성잡화</option>
            <option value="여성잡화">여성잡화</option>
            <option value="아동잡화">아동잡화</option>
            <option value="반려동물용품">반려동물용품</option></>)}
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
          </select>
        </div>
      </div>

      <span>가격</span>
      <div className="mb-3">
        <input type="number" className="form-control" name='price' id='price' value={product.price} placeholder="가격을 입력하세요" onChange={UpdateValue}/>
      </div> 
      <span>설명</span>
      <div className="mb-3">
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
      <div className='mt-3'>
        <Button variant='outline-dark' name='refreshedAt' onChange={UpdateValue}>끌어올리기</Button>
      </div>
      <Button variant='outline-dark mt-2 me-2' onClick={UpdateOk}>완료</Button>
      <Button variant='outline-dark mt-2' onClick={() => navigate(-1)}>이전으로</Button>
    </div>
  );
};

export default UpdatePage;