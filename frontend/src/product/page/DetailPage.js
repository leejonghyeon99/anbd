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
    }
  });

  const [files, setFiles] = useState([]);

  // 채팅방
  const [chatRoomId, setChatRoomId] = useState("");
  const [chatRoom, setChatRoom] = useState({
    id:"",
    seller:"",
    buyer:"",
    product:"",
    chats:[],
  });

  const [user, setUser] = useState({
    username: "",
    password: "",
    repassword: "",
    name: "",
    nickname: "",
    phone_number: "",
    email: "",
    region: "",
    auth: "", // 추가: 사용자 권한 정보
  });

  let token = "";

  useEffect(() => {
    token = localStorage.getItem("accessToken");
    const getUserInfoFromToken = (token) => {
      const decodedToken = atob(token.split(".")[1]);
      const userInfo = JSON.parse(decodedToken);
      return userInfo;
    };

    const userData = async () => {
      try {
        if (token) {
          // 토큰에서 사용자 정보를 추출
          const userInfo = getUserInfoFromToken(token);

          // 사용자 정보를 상태값에 설정
          console.log(userInfo)
          setUser(userInfo);

          // 서버에 사용자 정보 요청 보내기
          const response = await fetchWithToken(
            `${process.env.REACT_APP_API_BASE_URL}/api/user/info`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const additionalUserInfo = await response.json();
            // 서버에서 받은 추가 정보를 기존 사용자 정보에 합치기
            setUser((prevUserInfo) => ({
              ...prevUserInfo,
              ...additionalUserInfo,
            }));
          } else {
            console.error("Failed to fetch additional user info");
          }
        } else {
          // console.log("No token found, user is not logged in");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // userData 함수 실행 (컴포넌트가 마운트될 때 한 번만 실행하도록 빈 배열 전달)
    userData();
  }, []);

  useEffect(()=>{console.log(user);},[user])

  // 채팅하기
  const GoChat = () => {

    if (!user ) {
      console.log("사용자가 로그인되지 않았거나 사용자 이름이 없습니다.");
      // 사용자가 로그인되지 않았거나 사용자 이름이 없는 경우 처리할 코드
      return;
    }
    
    const requestData = {
      sellerId: product.user,
      buyerId: user.sub,   // JWT 로 받아와야함 
      productId: product.id
    };

    console.log("requestData:", requestData);

    fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/api/chatroom/room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(requestData)
    })
    .then(response => {
      if (!response.status === '200') {
        throw new Error('Network response was not ok');
      }
      // return response.json();
      return response.text();
    })
    .then(data => {
      if (!data) {
        throw new Error('Received empty response from the server');
      }
      console.log("chatRoomId: ", data);
    //   // 채팅방 ID 업데이트
    //   setChatRoomId(data);
    //   // 채팅방 생성 후 이동 
    //   navigate(`/chatRoom/${data}`, { state: {id: data}});

    // })
    // .catch(error => {
    //   console.error('Error:', error);
    //   // 오류 처리 추가
    //   alert('Failed to create chat room');
    // });
    // 만약 채팅방 ID가 존재한다면, 해당 ID를 사용
  if (data) {
    console.log("Existing chat room found with ID: ", data);
    // 채팅방 ID 업데이트
    setChatRoomId(data);
    // 채팅방으로 이동
    navigate(`/chatRoom/${data}`, { state: { id: data }});
  } else {
    console.log("New chat room created with ID: ", data);
    // 서버로부터 새로운 채팅방 ID를 받아서 사용
    // 채팅방 ID 업데이트
    setChatRoomId(data);
    // 새로운 채팅방으로 이동
    navigate(`/chatRoom/${data}`, { state: { id: data }});
  }
})

  };


  const UpdateOk = () => {
    navigate('/product/update/' + id);
  }
  
  // 리스트 페이지 이동
  const ListOk = () => {
    navigate('/product/list');
  }      
  useEffect(() => {
    fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/api/product/detail/` + id)
    .then(response => response.json())
    .then(data => setProduct(data));
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