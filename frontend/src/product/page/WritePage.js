import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GoogleMaps from "./GoogleMaps";
import { fetchWithToken } from "../../user/Reissue";
import "../CSS/WritePage.css";

const WritePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLocation, setSelectedLocation] = useState(""); // 기본 선택, 나중에 현재위치로 불러오기

  // GoogleMaps 활성여부
  const [showGoogleMaps, setShowGoogleMaps] = useState(false);

  // 위치
  useEffect(() => {
    if (location.state && location.state.location) {
      const { lat, lng } = location.state.location;
      const newLocation = `${lat}, ${lng}`;
      console.log("nl: " + newLocation);
      setSelectedLocation(newLocation); // 위도, 경도형식으로 문자열 저장 undefined
      // let a = setSelectedLocation(newLocation);
      // console.log("위경도" + a);  // undefined가 뜨는 이유는 set~은 상태값을 설정하며, 아무 것도 반환하지 않기 때문에
    }
  }, [location.state]);

  // 상품 정보 담는 곳
  const [product, setProduct] = useState({
    id: "",
    title: "",
    price: "",
    description: "",
    status: "",
    createdAt: "",
    location: "",
    user_id: "",
  });

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
        console.log("writepage 유저id : " + data.id);
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

  useEffect(() => {
    console.log("selectMain: " + selectMain);
    console.log("selectSub: " + selectSub);
  }, [selectMain, selectSub]);
  // 이미지 첨부
  // const uploadFile = (e) => {
  //     const selectedFiles = Array.from(e.target.files); // 선택된 파일 목록을 배열로 변환
  //     const uploadedFiles = selectedFiles.map((file) => ({
  //       originalName: file.name,  // 원본 파일명
  //       photoName:""  // 서버에서 생성된 저장된 파일 이름은 아직 모름
  //       // url: URL.createObjectURL(file), // 파일을 위한 URL 생성
  //     }));
  //     setFiles([...files, ...uploadedFiles]); // 기존 파일 목록과 새로 업로드된 파일 목록을 병합하여 상태 업데이트

  //     const updatedFiles = [...files, ...uploadedFiles]; // 기존 파일 목록과 새로 업로드된 파일 목록을 병합하여 업데이트
  //     setFiles(updatedFiles); // 파일 상태 업데이트
  // };
  //   // 이미지 삭제 기능
  //   const deleteFile = (index) => {
  //     const newFiles = [...files];
  //     newFiles.splice(index, 1); // 해당 인덱스의 파일 제거
  //     setFiles(newFiles); // 파일 목록 업데이트
  //   };
  // }

  // function uploadFile(e) {
  //     let fileArr = e.target.files;
  //     setPostImg(Array.from(fileArr));

  //     let fileUrl = [];
  //     for(let i = 0; i < fileArr.length; i++){
  //         let fileRead = new FileReader();
  //         fileRead.onload = function(){
  //             fileUrl[i] = fileRead.result;
  //             setPreviewImg([...fileUrl]);
  //             fileRead.readAsDataURL(fileArr[i]);
  //         }
  //     };
  // }

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

  // GoogleMaps의 표시 여부를 토글
  const toggleGoogleMaps = () => {
    setShowGoogleMaps((prevState) => !prevState);
  };

  // Main목록만 가져오는 카테고리
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product/category/main`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
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

  // 작성된 값
  const WriteValue = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
    console.log(e.target.value);
  };

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

  // product와 category 같이
  const pc = {
    ...product,
    category: {
      main: selectMain,
      sub: selectSub,
    },
    user_id: user_id,
  };

  // 추가버튼
  const handleAddFile = () => {
    // 파일 선택을 위한 input 요소를 클릭합니다.
    document.getElementById("fileInput").click();
  };

  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    // console.log(`files length: ${files.length}`);
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
    setSelectedFiles(newFiles); // 새 배열로 업데이트
    // console.log(`files: ${newFiles[0].originName}`);
  };

  // 작성 완료
  const WriteOk = (e) => {
    console.log(pc);
    e.preventDefault();

    // formData.append('product', JSON.stringify(pc));
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file.file));
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("status", product.status);
    formData.append("location", product.location);
    formData.append("categoryMain", selectMain);
    formData.append("categorySub", selectSub);
    formData.append("user_id", user_id);

    // pc 객체를 JSON 문자열로 변환하여 formData에 추가
    formData.append("product", JSON.stringify(pc));

    console.log("formData : ", ...formData);

    uploadedFiles(formData, {}, true);
  };

  // 상품 작성 동작 - 폼 데이터
  const uploadedFiles = async (formData, options = {}, isFormData = false) => {
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/api/product/write`,
        {
          method: "POST",
          body: formData,
        },
        true
      );

      if (response.status === 201) {
        try {
          const data = await response.json(); // 원본 응답에서 JSON 파싱 시도
          console.log("성공 응답 JSON:", data);
          alert("상품이 등록되었어요!");
          navigate(`/product/detail/${data.id}`); // 상세로 이동
        } catch (jsonError) {
          // JSON 파싱 과정에서 오류가 발생한 경우
          console.error("JSON 파싱 에러:", jsonError);
        }
      } else {
        console.error("등록 실패. 응답 상태 코드가 201이 아닙니다.");
        alert("등록 실패");
      }
    } catch (error) {
      // fetch 요청 자체에서 오류가 발생한 경우
      console.error("등록 과정 중 오류:", error);
      alert("등록 실패");
    }
  };

  // 목록
  const ListOk = () => {
    navigate(-1);
  };

  // 지도
  const MapOk = () => {
    navigate("/product/map");
  };
  return (
    <div className="write-box">
      {/* <span>이미지 첨부</span>
      <div className="mb-3">
        <input type="file" accept="image/*" name='files' id='files'  multiple/>
      </div>
      <div className="mb-2">
        <span>미리보기</span>
        {files.map((file, index) => {
          <div key={index}>
            <img src={file.url} alt={`Uploaded ${index}`} style={{ width: '100px', height: '100px' }} />
          </div>
        })}
      </div> */}


      <div>제목</div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          id="write-title"
          name="title"
          placeholder="제목을 입력하세요"
          onChange={WriteValue}
        />
      </div>
      {/* 대분류 선택후 중분류 선택 */}
      <div>
        <div>카테고리</div>
        <div className="mb-3">
          <select
            id="write-categorybg"
            className="form-select"
            name="main"
            value={selectMain}
            onChange={mainCategoryValue}
          >
            <option>-- 대분류 카테고리를 선택해주세요 --</option>
            {mainCategories.map((category) => (
              <option value={category}>{category}</option>
            ))}
          </select>
          <select
            id="write-categorymid"
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
      <div>가격</div>
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

      {/* 상태 */}
      <div>
        <select
          className="form-select"
          id="write-status"
          name="status"
          onChange={WriteValue}
        >
          <option selected>-- 판매 상태를 선택해주세요 --</option>
          <option value="SALE">판매중</option>
          {/* <option value="RESERVED">예약중</option>
          <option value="SOLD">판매완료</option> */}
        </select>
      </div>

      {/* 내용 */}
      <div className="mb-3 mt-3">
        <textarea
          cols="90"
          rows="10"
          id="write-description"
          name="description"
          placeholder="게시글 내용을 작성해주세요. 가품 및 판매금지품목은 게시가 제한될 수 있어요."
          onChange={WriteValue}
        />
      </div>

      <div className="write-map">
        {/* GoogleMaps를 표시하거나 숨기는 버튼 */}
        <button onClick={toggleGoogleMaps}>
          {showGoogleMaps ? "GoogleMaps 숨기기" : "GoogleMaps 표시하기"}
        </button>

        {/* GoogleMaps 컴포넌트를 props와 함께 조건부 렌더링 */}
        {showGoogleMaps && (
          <GoogleMaps
            props={{
              // 여기에 원하는 props를 전달.
              key: "value",
              anotherProp: "anotherValue",
            }}
            setLocation={setSelectedLocation}
          />
        )}
        <span>선택된 위치:  {selectedLocation ? `${selectedLocation.lat}, ${selectedLocation.lng}` : ''}</span>
      </div>

      <div id="write-file" className="mb-3 mt-3">
        <label>첨부파일</label><br/>
        
          {/* 첨부 파일 목록을 출력 */}
          {files.map((files, index) => (
            <div key={index}>{files.photoName}</div>
          ))}
        {/* 파일 선택을 위한 input 요소 */}
        <input
          type="file"
          name="files"
          id="fileInput"
          accept="image/*"
          onChange={handleFileChange}
          multiple
        />
        {/* 추가 버튼 */}
        {/* <div id="fileInput" onChange={handleFileChange}> */}
        
        {/* <button
          id="write-filebtn"
          className="btn btn-secondary"
          onClick={handleAddFile}
        >
          파일 추가
        </button> */}
      </div>
      <Button variant="outline-dark me-2" onClick={WriteOk}>
        완료
      </Button>
      <Button variant="outline-dark" onClick={ListOk}>
        취소
      </Button>
    </div>
  );
};

export default WritePage;