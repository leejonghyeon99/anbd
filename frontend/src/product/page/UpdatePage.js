import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GoogleMaps from "./GoogleMaps";
import { fetchWithToken } from "../../user/Reissue";

const UpdatePage = () => {
  let { id } = useParams();

  const navigate = useNavigate();

  const location = useLocation();
  const [selectedLocation, setSelectedLocation] = useState(""); // 기본 선택

  // GoogleMaps 활성여부
  const [showGoogleMaps, setShowGoogleMaps] = useState(false);

  useEffect(() => {
    if (location.state && location.state.location) {
      const { lat, lng } = location.state.location;
      setSelectedLocation(`${lat}, ${lng}`);
      console.log("위경도: " + setSelectedLocation(`${lat}, ${lng}`)); // 위도, 경도형식으로 문자열 저장
    }
  }, [location.state]);

  const [product, setProduct] = useState({
    title: "",
    id: id,
    description: "",
    price: 0,
    status: "",
    refreshedAt: "",
    location: "",
  });
  console.log("product: " + product);

  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState({});

  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [selectMain, setSelectMain] = useState("");
  const [selectSub, setSelectSub] = useState("");

  // product와 category 같이
  const pc = {
    ...product,
    category: {
      main: selectMain.main,
      sub: selectSub.sub,
    },
  };

  // 위치
  useEffect(() => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      location: selectedLocation, // 선택된 위치 업데이트
    }));
    console.log("::" + selectedLocation);
  }, [selectedLocation]);

  const toggleGoogleMaps = () => {
    setShowGoogleMaps((prevState) => !prevState); // GoogleMaps의 표시 여부를 토글
  };

  const UpdateValue = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
    console.log(e.target.value);
    console.log(product);
  };

  // Main목록만 가져오는 카테고리
  useEffect(() => {
    fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/api/product/category/main`)
      .then((response) => response.json())
      .then((data) => {
        setMainCategories(data);
      });
  }, []);

  // 특정 main에 sub 목록만 가져오는 카테고리
  const getSub = () => {
    const getByMainForSub = async () => {
      try {
        const url = `${process.env.REACT_APP_API_BASE_URL}/api/product/category/find?main=${selectMain.main}`;
        const response = await fetch(url);
        const data = await response.json();

        setSubCategories(data);
      } catch (error) {}
    };
    getByMainForSub();
  };

  // 대분류
  useEffect(() => {
    getSub();
  }, [selectMain]);

  // 선택된 main category 값
  const mainCategoryValue = (e) => {
    console.log("main");
    setSelectMain({
      id : e.target.value,
      main : e.target.options[e.target.selectedIndex].text,
    });
  };

  // 선택된 sub category 값
  const subCategoryValue = (e) => {
    console.log("sub");
    setSelectSub({
      id : e.target.value,
      sub : e.target.options[e.target.selectedIndex].text,
    });
  };

  // 지도
  const MapOk = () => {
    navigate("/product/map/" + id);
  };

  // 끌어올리기
  const refreshedAtValue = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${currentDate
      .getDate()
      .toString()
      .padStart(2, "0")}T${currentDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${currentDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${currentDate
      .getSeconds()
      .toString()
      .padStart(2, "0")}.${currentDate
      .getMilliseconds()
      .toString()
      .padStart(3, "0")}`; // 현재시간을 문자열로 변환
    console.log(formattedDate);
    setProduct({
      ...product,
      refreshedAt: formattedDate,
    }); // 상태 업데이트
  };

  // 상세
  useEffect(() => {
    fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/api/product/detail/` + id)
      .then((response) => response.json())
      .then((data) => setProduct(data));
  }, []);

  // 수정
  const UpdateOk = (e) => {
    e.preventDefault();
    console.log(product);

    fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/api/product/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset-utf-8",
      },
      body: JSON.stringify(pc),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(`수정되나`, response);
          return response.json();
        } else {
          return null;
        }
      })
      .then((data) => {
        if (data !== null) {
          alert("수정 완료");
          navigate(`/product/detail/${id}`);
        } else {
          alert("수정 실패");
        }
      });
  };

  return (
    <div>
      {/* <GoogleMaps props={id}></GoogleMaps> */}
      <h2>상품 수정</h2>
      <span>이미지 첨부</span>
      <div className="mb-3">
        <input type="file" name="productImage" />
      </div>
      <span>위치</span>
      <button onClick={toggleGoogleMaps}>
        {showGoogleMaps ? "GoogleMaps 숨기기" : "GoogleMaps 표시하기"}
      </button>

      {/* GoogleMaps 컴포넌트를 props와 함께 조건부 렌더링 */}
      {showGoogleMaps && (
        <GoogleMaps
          props={{
            // 여기에 원하는 props를 전달할 수 있습니다.
            key: "value",
            anotherProp: "anotherValue",
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
          name="title"
          id="title"
          placeholder="제목을 입력하세요"
          value={product.title}
          onChange={UpdateValue}
        />
      </div>
      {/* 대분류 선택후 중분류 선택 */}
      <div>
        <span>대분류</span>
        <div className="mb-3">
          <select className="form-select" name="main" value={selectMain.main} onChange={mainCategoryValue}>
            <option>-- 대분류 카테고리를 선택해주세요 --</option>
          {mainCategories.map(category =>
          ( 
            <option key={category.id} value={category.main}>{category.main}</option>)
          )}</select>
      
        <span>중분류</span>
          <select className="form-select" name='sub' value={selectSub.sub} onChange={subCategoryValue}>          
          <option>-- 중분류 카테고리를 선택해주세요 --</option>
          {subCategories.map(category => ( 
            <option key={category.id} value={category.sub}>{category.sub}</option>
          ))}
          </select>
        </div>
      </div>
      <span>가격</span>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          name="price"
          id="price"
          value={product.price}
          placeholder="가격을 입력하세요"
          onChange={UpdateValue}
        />
      </div>
      <span>설명</span>
      <div className="mb-3">
        <textarea
          cols="90"
          rows="10"
          name="description"
          value={product.description}
          placeholder="게시글 내용을 작성해주세요. 가품 및 판매금지품목은 게시가 제한될 수 있어요"
          onChange={UpdateValue}
        />
      </div>
      <span>상태</span>
      <div>
        <select
          className="form-select"
          name="status"
          value={product.status}
          onChange={UpdateValue}
        >
          <option selected>-- 판매 상태를 선택해주세요 --</option>
          <option value="SALE">판매중</option>
          <option value="RESERVED">예약중</option>
          <option value="SOLD">판매완료</option>
        </select>
      </div>
      <div className="">
        <Button
          variant="outline-dark"
          name="refreshedAt"
          onClick={refreshedAtValue}
        >
          끌어올리기
        </Button>
        <span>끌어올린 시간 : {product.refreshedAt}</span>
      </div>
      <Button variant="outline-dark me-2" onClick={UpdateOk}>
        완료
      </Button>
      <Button variant="outline-dark" onClick={() => navigate(-1)}>
        이전으로
      </Button>
    </div>
  );
};

export default UpdatePage;
