
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GoogleMaps from "./GoogleMaps";

import { VscClose } from 'react-icons/vsc';
import { fetchWithToken } from "../../user/api";
// import * as S from './style';
import { async } from "q";

const WritePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLocation, setSelectedLocation] = useState(""); // 기본 선택, 나중에 현재위치로 불러오기
  
  // GoogleMaps 활성여부
  const [showGoogleMaps, setShowGoogleMaps] = useState(false);

  // 위치
  useEffect(() =>
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
    createdAt: "",
    location: "",
  });

  const [user, setUser] = useState(null)
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem('accessToken');
  useEffect(() => {
    const getUser = async () => {
      try {
        const url = `${apiUrl}/api/user/profile`;
        // const options = {};
        const response = await fetch(url);
        const data = await response.json();
          console.log(data);
      } catch (error) {
        console.log("adsfadsfads");
      }
    };
    getUser();
  },[])

  // const [categories, setCategories] = useState([]);
  // const [selectCategory, setSelectCategory] = useState(null);

  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [selectMain, setSelectMain] = useState("");
  const [selectSub, setSelectSub] = useState("");
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
    setProduct((prevProduct) => ({
      ...prevProduct, 
      location: selectedLocation  // 선택된 위치 업데이트
    }));
    console.log('::' + selectedLocation);
  }, [selectedLocation]);

  // GoogleMaps의 표시 여부를 토글
  const toggleGoogleMaps = () => {
    setShowGoogleMaps(prevState => !prevState); 
  };

  // Main목록만 가져오는 카테고리
  useEffect(() => {
    fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/api/product/category/main`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
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
      } catch (error) {console.log(`error`);}
    }
    getByMainForSub();
 }

  // 대분류
  useEffect(() => {
    getSub();
  },[selectMain]);

  // 작성된 값
  const WriteValue = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
    console.log(e.target.value);
  };

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

  // product와 category 같이
  const pc = {
    ...product,
    category: {
      main: selectMain.main,
      sub: selectSub.sub
    },
  };

  // 추가버튼
  const handleAddFile = () => {
    // 파일 선택을 위한 input 요소를 클릭합니다.
    document.getElementById('fileInput').click();
  };

  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    console.log(`files length: ${files.length}`);
    const newFiles = [...selectedFiles]; // 기존 배열 복사
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let photoName = file.name;

        // 파일명에 현재 시간을 추가하여 중복 방지
        const pos = photoName.lastIndexOf(".");
        if (pos > -1) { // 확장자가 있는 경우
            const name = photoName.substring(0, pos); // 파일 이름
            const ext = photoName.substring(pos + 1); // 파일 확장자

            // 현재 시간(ms)을 이용하여 파일명에 추가
            photoName = `${name}_${Date.now()}.${ext}`;
        } else { // 확장자가 없는 경우
            photoName += `_${Date.now()}`;
        }
        console.log(`${photoName}`);
        const newFile = {
            originName: file.name,
            photoName: photoName
        };
        newFiles.push(newFile); // 파일 추가
        console.log(`originName: ${newFile.originName}`);
    }
    setSelectedFiles(newFiles); // 새 배열로 업데이트
    console.log(`files: ${newFiles}`);
};



  // 작성 완료
  const WriteOk = (e) => {
    console.log(pc);
    e.preventDefault();

    const formData = new FormData();
    // formData.append('product', JSON.stringify(pc));
    formData.append('title', product.title);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('status', product.status);
    formData.append('location', product.location);
    // formData.append('category_id', category.main);
    
    for (let index = 0; index < selectedFiles.length; index++) {
      const element = selectedFiles[index];
      formData.append('files', selectedFiles[index]);
    }
    // console.log(`jalfksdjljs: ${formData}`);

    // formData.append('files', selectedFiles[i]);
    // for (let i = 0; i < selectedFiles.length; i++) {
    //   console.log(`selectedFiles[i]: ${selectedFiles[i].originName}`);
    //   console.log(`selectedFiles[i]: ${selectedFiles[i].photoName}`);
    // }
    // console.log(`selectedFiles: ${selectedFiles}`);

    // console.log("formData.product "+formData.get('product'));
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]); // 모든 키-값 쌍을 출력합니다.
    // }
    console.log(...formData);

    const uploadedFiles = async (formData) =>{

      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product/write`, {
    // fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/api/product/write`, {
      method: "POST",
      body: formData,  // JSON 형식으로 데이터 전송
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
    }
    uploadedFiles(formData);
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
      <div className="mb-3 mt-3">
            <label>첨부파일:</label>
            <div id="files">
                {/* 첨부 파일 목록을 출력 */}
                {files.map((image, index) => (
        <div key={index}>{image.originName}</div>
                ))}
            </div>
            {/* 파일 선택을 위한 input 요소 */}
            <input type="file" name="files" id="fileInput" accept="image/*" onChange={handleFileChange} multiple />
            {/* 추가 버튼 */}
            {/* <div id="fileInput" onChange={handleFileChange}> */}

            <button className="btn btn-secondary" onClick={handleAddFile}>파일 추가</button>
    </div>

      <span>위치</span>
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
      <span>선택된 위치: {product.location}</span><br/>
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
          <select className="form-select" name="main" value={selectMain.main} onChange={mainCategoryValue}>
            <option>-- 대분류 카테고리를 선택해주세요 --</option>
          {mainCategories.map(category =>
          ( 
            <option value={category}>{category}</option>)
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
          <option selected>-- 판매 상태를 선택해주세요 --</option >
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
