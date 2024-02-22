import React, { useEffect, useState } from 'react';
import { Button, Image, Col } from 'react-bootstrap';
import { json, useNavigate, useParams } from 'react-router-dom';

const DetailPage = () => {
  const navigate = useNavigate();

  let {id} = useParams();

  const [product, setProduct] = useState({
    id:"",
    title:"",
    description:"",
    createdAt:"",
    price:"",
    middleCaztegory:"",
    user:"",
  });
  const [files, setFiles] = useState([]);

  // 채팅방
  const [chatRoom, setChatRoom] = useState({
    id:"",
    seller:"",
    buyer:"",
    product:"",
    chats:[],
  });
  
  // 채팅하기
  const GoChat = (productId) => {
    // const chatRoomId = chatRoom.id;
    // if (chatRoomId) {
    //     navigate(`/chat/${chatRoomId}`); // 채팅방 ID가 있을 경우에만 이동
    // } else {
    //     console.error('Chat room ID not available for product', productId);
    // }
  };
  const UpdateOk = () => {
    navigate('/product/update/'+id);
  }
  
  const ListOk = () => {
    navigate('/product/list');
  }
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product/detail/` + id)
    .then(response => response.json())
    .then(data => setProduct(data));
  }, []);

  const DeleteOk = () => {
    if(!window.confirm("정말 삭제하시겠습니까?")) return;
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product/delete/` + id, {
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
      <div className='mb-3'>
        <span>이미지</span>
        <Col xs={6} md={4}>
          <Image src={files} alt='product Image'/>
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