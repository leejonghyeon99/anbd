import React, { useEffect, useState } from 'react';
import { Button, Image, Col } from 'react-bootstrap';
import { json, useNavigate, useParams } from 'react-router-dom';
import { fetchWithToken } from "../../user/Reissue";

const DetailPage = () => {
  const navigate = useNavigate();

  let {id} = useParams();

  const [product, setProduct] = useState({
    id:"",
    title:"",
    description:"",
    refreshedAt:"",
    price:"",
    user:"",
    category:{
      sub:""
    },
    location: "",
    user_id: "",
  });

  const [selectFiles, setSelectFiles] = useState("");
  


  // 채팅하기
  const GoChat = () => {
    
  }

  const UpdateOk = () => {
    navigate('/product/update/' + id);
  }
  
  // 리스트 페이지 이동
  const ListOk = () => {
    navigate('/product/list/' + product.category.sub);
  }
  
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product/detail/` + id)
    .then(response => response.json(), console.log("디테일 응답 성공"))
    .then(data => setProduct(data), console.log("detailData : " + product))
  }, []);

  const DeleteOk = () => {
    if(!window.confirm("정말 삭제하시겠습니까?")) return;
    fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/api/product/delete/` + id, {
      method:"DELETE",
    })
    .then(response => response.text())
    .then(data => {
      if(data !== 'FAIL'){
        alert("삭제 성공");
        navigate('/product/list'); // 변경
      } else{
        alert("삭제 실패");
      }
    });
  }
  // 좋아요
  // const [wishList, setWishList] = useState({
  //   productId:id,
  //   userId:wishList.userId
  // });

  // 좋아요 상태 확인
  // useEffect(() => {
  //   fetch(`${process.env.REACT_APP_API_BASE_URL}/api/like`)
  //   .then(response => response.json())
  //   .then(data => setWishList(data.wishList));
  // }, [wishList.userId, wishList.productId]);

  // const LikeOk = () => {
  //   fetch(`${process.env.REACT_APP_API_BASE_URL}/api/like`,{
  //     method:"POST",
  //     headers:{
  //       "Content-Type": "application/json;charset-utf-8",
  //     },
  //     body:JSON.stringify(wishList),
  //   })
  //   .then(response => response.json())
  //   .then(data => setWishList(data))
  // }

  return (
    <div>
      <h2>상세</h2>
      {/* <Button onClick={LikeOk}>{wishList? '좋아요 취소' : '좋아요'}</Button> */}
      {/* <Heart src={wishList?HeartImg:EmptyHeartImg}/> */}

      <div className="container mt-3 mb-3 border rounded">
        <div className="mb-3 mt-3">
          <label>첨부파일:</label>
          {/* <ul className="list-group mb-1">
            {product.fileList.map((productImage, index) => (
            <li key={index} className="list-group-item">
              <a href={`/product/download?id=${productImage.id}`}>{productImage.originName}</a>
            </li> */}
          {/* ))} */}
          {/* </ul> */}
          {/* 이미지인 경우 보여주기 */}
        {/* {product.fileList.map((productImage, index) => (
          productImage.image && (
            <div key={index}>
              <img src={`/upload/product/${productImage.filename}`} className="img-thumbnail" alt="이미지이미지" />
            </div>
          )
        ))} */}
        </div>
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
        <span className='form-control'>{product.category.sub}</span>
        {/* <span className='form-control'>수정일자: {product.refreshedAt}</span> */}
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
        <Button variant='outline-dark mb-3' onClick={GoChat}>채팅하기</Button>
      </div>
      <div className='mb-3'>
        <Button variant='outline-dark me-2' onClick={UpdateOk}>수정</Button>
        <Button variant='outline-dark me-2' onClick={DeleteOk}>삭제</Button>
        <Button variant='outline-dark me-2' onClick={ListOk}>목록</Button>
      </div>
    </div>
  );
};

export default DetailPage;