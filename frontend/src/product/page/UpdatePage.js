import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const UpdatePage = () => {

  let {id} = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title:"",
    description:"",
    price:"",
    status:"",
    refreshAt:"",
    middleCategory:"",
    category:""
  });

  const UpdateValue = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    })
  }
  useEffect(() => {
    fetch("http://localhost:8080/api/product/detail/"+id)
    .then(response => response.json())
    .then(data => setProduct(data));
  }, []);

  const UpdateOk = (e) =>{
    e.preventDefault();

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
        alert('수정완료');
        navigate(`/detail/${id}`);
      } else {
        alert('수정 실패');
      }
    })
  }

  const ListOk = () => {
    navigate('/list');
  }

  return (
    <div>
      <h2>상품 수정</h2>
      <span>이미지 첨부</span>
      <div className="mb-3">
        <input type="file" />
      </div>
      <span>위치</span>
      <div className="mb-3">
        <input type=""></input>
      </div>
      <span>제목</span>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          name="title"
          placeholder="제목을 입력하세요"
          onChange={UpdateValue}
        />
      </div>
      <div>
        <span>대분류</span>
        <div className="mb-3">
        <select className="form-select" onChange={UpdateValue}>
            <option value="-- 대분류 카테고리를 선택해주세요 --">-- 대분류 카테고리를 선택해주세요 --</option>
            <option value="clothes">의류</option>
            <option value="foods">식품</option>
            <option value="life">생활용품</option>
          </select>
          <span>중분류</span>
          <select className="form-select" onChange={UpdateValue}>
          <option value="-- 중분류 카테고리를 선택해주세요 --">-- 중분류 카테고리를 선택해주세요 --</option>
            <option value="fclothes">여성의류</option>
            <option value="mclothes">남성의류</option>
            <option value="kclothes">아동의류</option>
          </select>
        </div>
      </div>

      <span>가격</span>
      <div className="mb-3">
        <input type="number" className="form-control" placeholder="가격을 입력하세요" onChange={UpdateValue}/>
        <input type="checkbox" className="form-check-input" />
        <small>가격 제안받기</small>
      </div>
      <div className="mb-3 mt-3">
        <textarea cols='90' rows='10' placeholder="게시글 내용을 작성해주세요. 가품 및 판매금지품목은 게시가 제한될 수 있어요"/>
      </div>
      <span>상태</span>
      <div>
        <select className="form-select" onChange={UpdateValue}>
          <option value="SALE">판매중</option>
          <option value="RESERVED">예약중</option>
          <option value="SOLD">판매완료</option>
        </select>
      </div>
      <div className='mt-3'>
        <Button variant='outline-dark' onChange={UpdateValue}>끌어올리기</Button>
      </div>
      <Button variant='outline-dark mt-2 me-2' onClick={UpdateOk}>완료</Button>
      <Button variant='outline-dark mt-2' onClick={() => navigate(-1)}>이전으로</Button>
    </div>
  );
};

export default UpdatePage;