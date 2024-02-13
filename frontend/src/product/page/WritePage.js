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
    category: ""
  });

  // const [productImg, setProductImg] = useState({
  //   originName:"",
  //   photoName:"",
  //   product:"",
  //   user:""
  // });

  // const uploadFile = (e) => {
  //   let fileArr = e.target.files;
  //   setProductImg(Array.from(fileArr));
  //   console.log(fileArr);
  //   let file
  // }
  // const [previewImg, setPreviewImg] = useState([]);

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
          navigate(`/api/product/detail/${data.id}`); // 상세로 이동
        } else {
          alert("등록 실패");
        }
      });
  };
  const ListOk = () => {
    navigate("/api/product/list");
  };

  return (
    <div>
      <h2>상품 등록</h2>
      <span>이미지 첨부</span>
      {/* <div className="mb-3">
        <input type="file" accept="image/jpg,impage/png, image/jpeg, image/gif" name='img' onChange={WriteValue} multiple/>
      </div> */}
      <span>위치</span>
      <div className="mb-3">
        {/* <input type=""></input> */}
        <select className="form-select" onChange={WriteValue}>
          <option value></option>
        </select>
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
      <div>
        <span>대분류</span>
        <div className="mb-3">
          <select
            className="form-select"
            id="category"
            name="category"
            onChange={WriteValue}
          >
            <option value="-- 대분류 카테고리를 선택해주세요 --">
              -- 대분류 카테고리를 선택해주세요 --
            </option>
            <option value="1">의류</option>
            <option value="2">식품</option>
            <option value="3">생활용품</option>
          </select>
          <span>중분류</span>
          <select
            className="form-select"
            id="middleCategory"
            name="middleCategory"
            onChange={WriteValue}
          >
            <option value="-- 중분류 카테고리를 선택해주세요 --">
              -- 중분류 카테고리를 선택해주세요 --
            </option>
            <option value="여성의류">여성의류</option>
            <option value="남성의류">남성의류</option>
            <option value="아동의류">아동의류</option>
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
          <option value="-- 판매 상태를 선택해주세요 --">
            -- 판매 상태를 선택해주세요 --
          </option>
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
