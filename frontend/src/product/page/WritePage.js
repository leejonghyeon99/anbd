import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const WritePage = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    id: "",
    title: "",
    price: 0,
    description: "",
    status: "-- 판매 상태를 선택해주세요 --",
    middleCategory: "-- 중분류 카테고리를 선택해주세요 --",
    createdAt: "",
    category: "",
  });
  const [productImg, setProductImg] = useState({
    originName:"",
    photoName:""
  });

  const uploadFile = (e) => {
    let fileArr = e.target.files;
    setProductImg(Array.from(fileArr));
    console.log(fileArr);
    let file
  }

  const WriteValue = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
    console.log(e.target.value);
  };

  const WriteOk = (e) => {
    console.log(product);
    e.preventDefault();

    fetch("http://localhost:8080/api/product/write", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(product),
    })
      .then((response) => {
        console.log(`응답하라`, response);
        if (response.status === 201) {
          // CREATED
          return response.json();
        } else {
          console.error("Unexpected response status : ", response.status);
          return null;
        }
      })
      .then((data) => {
        if (data !== null) {
          console.log(`작성해라`, data);
          alert("상품이 등록되었어요!");
          navigate(`/product/detail/${data.id}`); // 상세로 이동
        } else {
          alert("등록 실패");
        }
      });
  };
  const ListOk = () => {
    navigate("/product/list");
  };

  return (
    <div>
      <h2>글쓰기</h2>
      <span>이미지 첨부</span>
      <div className="mb-3">
        <input type="file" accept="image/jpg,impage/png, image/jpeg, image/gif" name='productImage' onChange={WriteValue} multiple/>
      </div>
      <span>위치</span>
      <div className="mb-3">
        <Button variant="outline-dark ">위치 선택</Button>
        {/* <select className="form-select" onChange={WriteValue}>
          <option value></option>
        </select> */}
      </div>
      <span>제목</span>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          id="title"
          name="title"
          placeholder="제목을 입력하세요"
          onChange={WriteValue}
        />
      </div>
      {/* 대분류 선택후 중분류 선택 */}
      <div>
        <span>대분류</span>
        <div className="mb-3">
        <select className="form-select" name='category' value={product.category} onChange={WriteValue}>
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
          <select className="form-select" name='middleCategory' value={product.middleCategory} onChange={WriteValue}>
            {product.category === 'null' && (
            <><option selected disabled>-- 대분류 먼저 선택해주세요 --</option></>)}
            {product.category === '1' && (
            <><option selected disabled>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="여성의류">여성의류</option> 
            <option value="남성의류">남성의류</option>
            <option value="아동의류">아동의류</option></>)}
            {product.category === '2' && (
            <><option disabled selected>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="가공식품">가공식품</option>
            <option value="기타식품">기타식품</option></>)}
            {product.category === '3' && (
            <><option disabled selected>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="주방용품">주방용품</option>
            <option value="욕실용품">욕실용품</option></>)}
            {product.category === '4' && (
            <><option disabled selected>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="남성잡화">남성잡화</option>
            <option value="여성잡화">여성잡화</option>
            <option value="아동잡화">아동잡화</option>
            <option value="반려동물용품">반려동물용품</option></>)}
            {product.category === '6' && (
            <><option disabled selected>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="디지털기기">디지털기기</option>
            <option value="주방가전">주방가전</option>
            <option value="리빙가전">리빙가전</option></>)}
            {product.category === '7' && (
            <><option disabled selected>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="도서">도서</option>
            <option value="유아도서">유아도서</option></>)}
            {product.category === '8' && (
            <><option disabled selected>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="기타">기타</option></>)}
          </select>
        </div>
      </div>

      <span>가격</span>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          id="price"
          name="price"
          placeholder="가격을 입력하세요"
          onChange={WriteValue}
        />
      </div>
      <div className="mb-3 mt-3">
        <textarea
          cols="90"
          rows="10"
          id="description"
          name="description"
          placeholder="게시글 내용을 작성해주세요. 가품 및 판매금지품목은 게시가 제한될 수 있어요"
          onChange={WriteValue}
        />
      </div>
      <span>상태</span>
      <div>
        <select
          className="form-select"
          id="status"
          name="status"
          onChange={WriteValue}
        >
          <option disabled selected>-- 판매 상태를 선택해주세요 --</option >
          <option value="SALE">판매중</option>
          <option value="RESERVED">예약중</option>
          <option value="SOLD">판매완료</option>
        </select>
      </div>
      <Button variant="outline-dark mt-2 me-2" onClick={WriteOk}>
        완료
      </Button>
      <Button variant="outline-dark mt-2" onClick={ListOk}>
        취소
      </Button>
    </div>
  );
};

export default WritePage;
