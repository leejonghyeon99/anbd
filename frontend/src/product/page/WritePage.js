
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GoogleMaps from "./GoogleMaps";

const WritePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLocation, setSelectedLocation] = useState(""); // 기본 선택, 나중에 현재위치로 불러오기
  
  // GoogleMaps 활성여부
  const [showGoogleMaps, setShowGoogleMaps] = useState(false);

  // 위치
  useEffect(() => {
    if (location.state && location.state.location) {
      const {lat, lng} = location.state.location;
      const newLocation = `${lat}, ${lng}`;
      console.log("nl: " + newLocation);
      setSelectedLocation(newLocation); // 위도, 경도형식으로 문자열 저장 undefined
      // let a = setSelectedLocation(newLocation); 
      // console.log("위경도" + a);  // undefined가 뜨는 이유는 set~은 상태값을 설정하며, 아무 것도 반환하지 않기 때문에
    }
  }, [location.state]);

  // 상품
  const [product, setProduct] = useState({
    id: "",
    title: "",
    price: "",
    description: "",
    status: "",
    middleCategory: "",
    createdAt: "",
    location: "",
  });

  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");

  // product와 category 같이
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

  // 카테고리
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product/category`)
    .then(response => response.json())
    .then(data => {
      setCategories(data);
    });
  }, []);

  useEffect(() => {
    console.log("categories " + categories);
  },[categories]);

  // 이미지
  const [files, setFiles] = useState([]);

  // 이미지 첨부
  const uploadFile = (e) => {
    let fileArr = e.target.files;
    setFiles(Array.from(fileArr)); // 업로드한 files를 배열로
    console.log("fileArr " + fileArr);
    console.log("fileArr[0] " + fileArr[0].name);

    // let fileUrl = [];
    // let fileKeys = [];

    // for (let i = 0; i < fileArr.length; i++) {
    //   let fileRead = new FileReader();
    //   fileRead.onload = function(){
    //     let url = fileRead.result;
    //     let key = i.toString();

    //     fileUrl.push(url);
    //     fileKeys.push(key);

    //     console.log("File Url i" , i, ":", url);
    //     console.log("File Key i" , i, ":", key);
    //   }
    //   fileRead.readAsDataURL(fileArr[i]);
    // }
    // let fileUrl = [];
    // let fileKeys = [];
    // for (let i = 0; i < fileArr.length; i++) {
    //   let fileRead = new FileReader();
    //   fileRead.onload = function(){
    //     fileUrl[i] = fileRead.result;
    //     console.log("fileUrl[i] : " + fileUrl[i]);
    //     console.log("fileKeys[i] : " + fileKeys[i]);
    //   }
    //   // 파일 key값을 가져오기 위해 파일명 사용
    //   let fileName = fileArr[i].name;
    //   fileKeys.push(fileName);
    //   console.log("파일key : " + fileKeys.push(fileName));
    //   // 파일 읽기
    //   fileRead.readAsDataURL(fileArr[i]);
    // }

    let fileData = [];  // 파일의 URL과 키를 담을 배열
    const uploadAndSave = (file, index) => {
      let fileRead = new FileReader();
      fileRead.onload = function(){
        let url = fileRead.result;
        let key = index.toString();
        fileData.push({url, key});
        console.log("file Url", index, ":", url);
        console.log("file Key", index, ":", key);
      }
      fileRead.readAsDataURL(file);
    }
    for (let i = 0; i < fileArr.length; i++) {
      uploadAndSave(fileArr[i], i);
    }
    console.log("fileData", fileData);
  }

  // 작성된 값
  const WriteValue = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
    console.log(e.target.value);
  };
  // 선택된 category 값
  const CategoryValue = (e) => {
    setSelectCategory(e.target.value);
    console.log("category " + e.target.value);
  }
  // 작성 완료
  const WriteOk = (e) => {
    console.log(product);
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product/write`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(pc),  // JSON 형식으로 데이터 전송
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
  // 목록
  const ListOk = () => {
    navigate("/product/list");
  };

  // 지도
  const MapOk = () => {
    navigate("/product/map");
  }
  return (
    <div>
      <h2>글쓰기</h2>
      <span>이미지 첨부</span>
      <div className="mb-3">
        <input type="file" accept="image/jpg,impage/png, image/jpeg, image/gif" name='files' id='files' onChange={uploadFile} multiple/>
      </div>
      <span>위치</span>
      {/* {selectedLocation !== "" && (
      <div className="mb-3">
        <Button variant="outline-dark" onClick={MapOk} >위치 선택</Button>
        <input type="button" name="location" id="location" value={product.location} onChange={WriteValue} onClick={MapOk}/>위치 선택
        <span>선택된 위치 location: {selectedLocation}</span>
        </div>
      )} */}
      {/* <GoogleMaps props={}></GoogleMaps> */}
      {/* GoogleMaps를 표시하거나 숨기는 버튼 */}
      <button onClick={toggleGoogleMaps}>
        {showGoogleMaps ? 'GoogleMaps 숨기기' : 'GoogleMaps 표시하기'}
      </button>

      {/* GoogleMaps 컴포넌트를 props와 함께 조건부 렌더링 */}
      {showGoogleMaps && (
        <GoogleMaps
          props={{
            // 여기에 원하는 props를 전달.
            key: 'value',
            anotherProp: 'anotherValue',
          }}
        />
      )}
      <span>선택된 위치: {product.location}</span>
      {/* <input type="button" name="location" id="location" value={product.location} onClick={MapOk}></input><br/> */}
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
          <select className="form-select" name="category" value={selectCategory.id} onChange={CategoryValue}>
            <option>-- 대분류 카테고리를 선택해주세요 --</option>
          {categories.map(category =>
          ( 
            <option key={category.id} value={category.id}>{category.name}</option>)
          )}</select>
      
      <span>중분류</span>
          <select className="form-select" name='middleCategory' value={product.middleCategory} onChange={WriteValue}>
            {/* {product.category === 'null' && (
              <><option value="" selected>-- 대분류 먼저 선택해주세요 --</option></>
            )} */}
            {/* { === '1' && (
            <><option value disabled selected>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="여성의류">여성의류</option> 
            <option value="남성의류">남성의류</option>
            <option value="아동의류">아동의류</option></>)}
            {product.category === '2' && (
            <><option value disabled selected>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="가공식품">가공식품</option>
            <option value="기타식품">기타식품</option>
            </>)}
            {product.category === '3' && (
            <><option isabled selected>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="주방용품">주방용품</option>
            <option value="욕실용품">욕실용품</option></>)}
            {product.category === '4' && (
            <><option disabled selected>-- 중분류 카테고리를 선택해주세요 --</option> 
            <option value="남성잡화">남성잡화</option>
            <option value="여성잡화">여성잡화</option>
            <option value="아동잡화">아동잡화</option>
            <option value="반려동물용품">반려동물용품</option></>)}
            {product.category === '5' && (
            <><option disabled selected>-- 중분류 카테고리를 선택해주세요 --</option>
            <option value="가구">가구</option>
            <option value="인테리어">인테리어</option></>)}
            {product.category === '6' && (
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
            <option value="기타">기타</option></>)} */}
          
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
          <option disabled selected>-- 판매 상태를 선택해주세요 --</option >
          <option value="SALE">판매중</option>
          <option value="RESERVED">예약중</option>
          <option value="SOLD">판매완료</option>
        </select>
      </div>
      <Button variant="outline-dark me-2" onClick={WriteOk}>완료</Button>
      <Button variant="outline-dark" onClick={ListOk}>취소</Button>
    </div>
  );
};

export default WritePage;
