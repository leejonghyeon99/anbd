import React, { useEffect, useState } from 'react';
import { Button, Image, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const DetailPage = () => {
  const navigate = useNavigate();

  let {id} = useParams();

  const [product, setProduct] = useState({
    id:"",
    title:"",
    description:"",
    createdAt:"",
    price:"",
    middleCategory:"",
    user:"",
  });

  const GoChat = () => {
    
  }
  const UpdateOk = () => {
    navigate('/product/update/'+id);
  }
  
  const ListOk = () => {
    navigate('/product/list');
  }
  useEffect(() => {
    fetch("http://localhost:8080/api/product/detail/" + id)
    .then(response => response.json())
    .then(data => setProduct(data));
  }, []);

  const DeleteOk = () => {
    if(!window.confirm("정말 삭제하시겠습니까?")) return;
    fetch("http://localhost:8080/api/product/delete/" + id, {
      method:"DELETE",
    })
    .then(response => response.text())
    .then(data => {
      if(data !== 'FAIL'){
        alert("삭제 성공");
        navigate('/product/list');
      } else{
        alert("삭제 실패");
      }
    });
  }

  return (
    <div>
      <h2>상세</h2>
      <div className='mb-3'>
        <span>이미지</span>
        <Col xs={6} md={4}>
          <Image src=''/>
        </Col>
      </div>
      <span>title</span>
      <div className='mb-3'>
        <span className='form-control'>{product.title}</span>
      </div>
      <span>user</span>
      <div className='mb-3'>
        <span className='form-control'>{product.user}</span>
      </div>
      <span>카테고리</span>
      <div className='mb-3'>
        <span className='form-control'>{product.middleCategory}</span>
        <span className='form-control'>{product.createdAt}</span>
      </div>
      <span>내용</span>
      <div className='mb-3'>
       <span className='form-control'>{product.description}</span>
      </div>
      <span>가격</span>
      <div className='mb-3'>
        <span className='form-control'>{product.price}</span>
      </div>
      <div className='mb-3'>
        <input type='checkbox' className='me-2'></input>
        <Button variant='outline-dark mb-3' onClick={GoChat}>채팅하기</Button>
      </div>
      <div className='mb-3'>
        <Button variant='outline-dark me-2 mb-3' onClick={UpdateOk}>수정</Button>
        <Button variant='outline-dark me-2 mb-3' onClick={DeleteOk}>삭제</Button>
        <Button variant='outline-dark me-2 mb-3' onClick={ListOk}>목록</Button>
      </div>
    </div>
  );
};

export default DetailPage;