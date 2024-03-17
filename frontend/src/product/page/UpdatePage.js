import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GoogleMaps from "./GoogleMaps";
import { fetchWithToken } from "../../user/Reissue";
import "../CSS/UpdatePage.css";

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
      const newLocation = `${lat}, ${lng}`;
      console.log("nl: " + newLocation);
      setSelectedLocation(newLocation); // 위도, 경도형식으로 문자열 저장 
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
    user_id: "",
    fileList:[],
    deleteFile:[]
  });
  console.log("product: " + product);

  // 유저id 불러오기
  const [user_id, setUser_id] = useState("");
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const getUser = async () => {
      try {
        const url = `${apiUrl}/api/user/info`;
        const response = await fetchWithToken(url);
        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }
        const data = await response.json();
        console.log("updatePage 유저id : " + data.id);
        setUser_id(data.id); // 사용자 ID를 user 상태에 저장
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    getUser();
  }, []);

  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [selectMain, setSelectMain] = useState("");
  const [selectSub, setSelectSub] = useState("");

  // product와 category 같이
  const pc = {
    ...product,
    category: {
      main: selectMain,
      sub: selectSub,
    },
    user_id: user_id,
  };

  // 위치
  useEffect(() => {
    if (selectedLocation) {
      const {lat, lng} = selectedLocation;
      const roundLat = parseFloat(lat).toFixed(5);  // 5자리
      const roundLng = parseFloat(lng).toFixed(5);
      const newLocation = `${roundLat}, ${roundLng}`;
      setProduct((prevProduct) => ({
        ...prevProduct,
        location: newLocation, // 선택된 위치 업데이트
      }));
      console.log("선택된 위치: " + newLocation);
    }
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
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/product/category/main`
    )
      .then((response) => response.json())
      .then((data) => {
        setMainCategories(data);
      });
  }, []);

  // 특정 main에 sub 목록만 가져오는 카테고리
  const getSub = () => {
    const getByMainForSub = async () => {
      try {
        const url = `${process.env.REACT_APP_API_BASE_URL}/api/product/category/find?main=${selectMain}`;
        const response = await fetch(url);
        const data = await response.json();

        setSubCategories(data);
      } catch (error) {
        console.log(`error`);
      }
    };
    getByMainForSub();
  };

  // 대분류
  useEffect(() => {
    getSub();
  }, [selectMain]);

  // 선택된 main category 값
  // const mainCategoryValue = (e) => {
  //   console.log("main");
  //   setSelectMain({
  //     id: e.target.value,
  //     main: e.target.options[e.target.selectedIndex].text,
  //   });
  // };

  // // 선택된 sub category 값
  // const subCategoryValue = (e) => {
  //   console.log("sub");
  //   setSelectSub({
  //     id: e.target.value,
  //     sub: e.target.options[e.target.selectedIndex].text,
  //   });
  // };

  // 선택된 main category 값
  const mainCategoryValue = (e) => {
    console.log("main");
    setSelectMain(e.target.options[e.target.selectedIndex].text);
  };

  // 선택된 sub category 값
  const subCategoryValue = (e) => {
    console.log("sub");
    setSelectSub(e.target.options[e.target.selectedIndex].text);
  };

  // 지도
  const MapOk = () => {
    navigate("/product/map/" + id);
  };


  // 이미지
  // 추가버튼
  const handleAddFile = () => {
    // 파일 선택을 위한 input 요소를 클릭합니다.
    document.getElementById("fileInput").click();
  };
  
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const newFiles = [...selectedFiles]; // 기존 배열 복사
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const photoName = file.name; // 원본 파일 이름 사용

      const newFile = {
        originName: file.name,
        // photoName: photoName // 파일 이름 변경 없이 원본 파일 이름 사용
        file: file,
      };
      newFiles.push(newFile); // 파일 추가
    }
    setSelectedFiles(newFiles); // 새 배열로 업데이트\
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
    fetchWithToken(
      `${process.env.REACT_APP_API_BASE_URL}/api/product/detail/` + id
    )
      .then((response) => response.json())
      .then((data) => setProduct(data));
  }, []);

  // 수정
  // const UpdateOk = (e) => {
  //   e.preventDefault();
  //   console.log(pc);

  //   fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/api/product/update`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json;charset-utf-8",
  //     },
  //     body: JSON.stringify(pc),
  //   })
  //     .then((response) => {
  //       if (response.status === 200) {
  //         console.log(`수정되나`, response);
  //         return response.json();
  //       } else {
  //         return null;
  //       }
  //     })
  //     .then((data) => {
  //       if (data !== null) {
  //         alert("수정 완료");
  //         navigate(`/product/detail/${id}`);
  //       } else {
  //         alert("수정 실패");
  //       }
  //     });
  // };
  const UpdateOk = (e) => {
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file.file));
    formData.append('delfile', product.deleteFile.join(","));
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("status", product.status);
    formData.append("location", product.location);
    formData.append("categoryMain", selectMain);
    formData.append("categorySub", selectSub);
    formData.append("refeshed_at", product.refreshedAt)
    formData.append("user_id", user_id);

    // pc 객체를 JSON 문자열로 변환하여 formData에 추가
    formData.append("product", JSON.stringify(pc));

    console.log("formData : ", ...formData);

    uploadedFiles(formData, {}, true);
  }

  // 상품 작성 동작 - 폼 데이터
  const uploadedFiles = async (formData, options = {}, isFormData = false) => {
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/api/product/update`,
        {
          method: "PUT",
          body: formData,
        },
        true
      );

      if (response.status === 200) {
        try {
          const data = await response.json(); // 원본 응답에서 JSON 파싱 시도
          console.log("성공 응답 JSON:", data);
          alert("상품이 수정되었어요!");
          navigate(`/product/detail/${data.id}`); // 상세로 이동
        } catch (jsonError) {
          // JSON 파싱 과정에서 오류가 발생한 경우
          console.error("JSON 파싱 에러:", jsonError);
        }
      } else {
        console.error("수정 실패. 응답 상태 코드가 200이 아닙니다.");
        alert("수정 실패");
      }
    } catch (error) {
      // fetch 요청 자체에서 오류가 발생한 경우
      console.error("수정 과정 중 오류:", error);
      alert("수정 실패");
    }
  };

  // 이미지 삭제
  // const deleteFile = (index) =>{
  //   const newFiles = [...files];
  //   newFiles.splice(index, 1);
  //   setFiles(newFiles);
  // }
  // 파일 삭제 요청을 서버로 전송하는 함수
const handleDeleteFile = (fileId) => {
  console.log(`클릭은 되나`);
  alert('삭제하시겠습니까?')
  setProduct((prevProduct) => ({
    ...prevProduct,
    deleteFile:[...prevProduct.deleteFile || [], fileId]
  }))
};

  return (
    <div className="update-box">
      <h2>수정</h2>
      <div>제목</div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          name="title"
          id="update-title"
          placeholder="제목을 입력하세요"
          value={product.title}
          onChange={UpdateValue}
        />
      </div>

      {/* 대분류 선택후 중분류 선택 */}
      <div>
        <div>카테고리</div>
        <div className="mb-3">
          <select
            id="update-categorybg"
            className="form-select"
            name="main"
            value={selectMain}
            onChange={mainCategoryValue}
          >
            <option>-- 대분류 카테고리를 선택해주세요 --</option>
            {mainCategories.map((category) => (
              <option value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            id="update-categorymid"
            className="form-select"
            name="sub"
            value={selectSub}
            onChange={subCategoryValue}
          >
            <option>-- 중분류 카테고리를 선택해주세요 --</option>
            {subCategories.map((category) => (
              <option key={category.id} value={category.sub}>
                {category.sub}
              </option>
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
          id="update-price"
          value={product.price}
          placeholder="가격을 입력하세요"
          onChange={UpdateValue}
        />
      </div>

      {/* 상태 */}
      <div>
        <select
          className="form-select"
          id="update-status"
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

      {/* 내용 */}
      <div className="mb-3 mt-3">
        <textarea
          cols="90"
          rows="10"
          id="update-description"
          name="description"
          value={product.description}
          placeholder="게시글 내용을 작성해주세요. 가품 및 판매금지품목은 게시가 제한될 수 있어요"
          onChange={UpdateValue}
        />
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
          setLocation={setSelectedLocation}
        />
      )}
      <br/>
      <span>선택된 위치: {selectedLocation ? `${selectedLocation.lat}, ${selectedLocation.lng}` : ''}</span>

      {/* <input type="button" name="location" id="location" value={product.location} onClick={MapOk}></input><br/> */}

      <br/>
      <div className="mb-3">
        <input type="file" name="productImage" />
      </div>
      <div className="mb-3 mt-3">
    <label>기존 첨부파일:</label>
    {product.fileList.map((productImage) => (
        <div key={productImage.id} className="input-group mb-2">
            <input className="form-control col-xs-3" type="text" readOnly value={productImage.photoName} />
            <button type="button" className="btn btn-outline-danger" data-fileid-del={productImage.id} onClick={() => handleDeleteFile(productImage.id)}>
                삭제
            </button>
        </div>
    ))}
    <div class="container mt-3 mb-3 border rounded">
                <div class="mb-3 mt-3">
                    <label>새로운 첨부파일:</label>
                    {/* <div id="files">

                    </div> */}
                    {/* <button type="button" id="btnAdd" class="btn btn-secondary">추가</button> */}
                    <div id="fileInput" onChange={handleFileChange}>
                    <button
          id="write-filebtn"
          className="btn btn-secondary"
          onClick={handleAddFile}
        >
          파일 추가
        </button>
        </div>
                </div>
            </div>
</div>
      <div>
        <Button
        id="pushBtn"
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
