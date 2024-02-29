
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GoogleMaps from "./GoogleMaps";

import { VscClose } from 'react-icons/vsc';
import { fetchWithToken } from "../../user/Reissue";
// import * as S from './style';

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
    createdAt: "",
    location: "",
  });

  // const [categories, setCategories] = useState([]);
  // const [selectCategory, setSelectCategory] = useState(null);

  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [selectMain, setSelectMain] = useState("");
  const [selectSub, setSelectSub] = useState("");

  // 이미지
  const [files, setFiles] = useState([]);

  // 이미지 첨부
  const uploadFile = (e) => {
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
  }
  //* 화면에 출력될 파일과 서버에 보내질 파일을 구분할 필요없다. 
  //화면에 출력되는 파일
  // const [selectedImages, setSelectedImages] = useState([]);
  // //서버에 보내지는 파일
  // const [selectedFiles, setSelectedFiles] = useState(null);

  // const onSelectFile = (e: any) => {
  //   e.preventDefault();
  //   e.persist();
  //   //선택한 파일 
  //   const selectedFiles = e.target.files;
  //   //선택한 파일들을 fileUrlList에 넣어준다. 
  //   const fileUrlList = [...selectedFiles];

  //   // 업로드되는 파일에는 url이 있어야 한다. filePath로 보내줄 url이다.
  //   //획득한 Blob URL Address를 브라우져에서 그대로 호출 시에 이미지는 표시가 되고 ,
  //   //일반 파일의 경우 다운로드를 할 수 있다.
  //   for (let i = 0; i < selectedFiles.length; i++) {
  //     const nowUrl = URL.createObjectURL(selectedFiles[i]);
  //     fileUrlList.push(nowUrl[i]);
  //   }

  //   setSelectedFiles(fileUrlList);

  //   //Array.from() 은 문자열 등 유사 배열(Array-like) 객체나 이터러블한 객체를 배열로 만들어주는 메서드이다.
  //   const selectedFileArray: any = Array.from(selectedFiles);

  //   //브라우저 상에 보여질 파일 이름
  //   const imageArray = selectedFileArray.map((file: any) => {
  //     return file.name;
  //   });

  //   // 첨부파일 삭제시
  //   setSelectedImages((previousImages: any) => previousImages.concat(imageArray));
  //   e.target.value = '';
  // };

  // //브라우저상에 보여질 첨부파일
  // const attachFile =
  //   selectedImages &&
  //   selectedImages.map((image: any) => {
  //     return (
  //       <S.DivImg key={image}>
  //         <div>{image}</div>
  //         <button onClick={() => setSelectedImages(selectedImages.filter((e) => e !== image))}>
  //         <VscClose size='30' /> 
  //         </button>
  //       </S.DivImg>
  //     );
  //   });

  // product와 category 같이
  const pc = {
    ...product,
    category: {
      main: selectMain.main,
      sub: selectSub.sub
    },
    files: files
  };
  useEffect(() => {
    console.log(`files: ${files.originalName}`);
  })

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

  // 작성 완료
  const WriteOk = (e) => {
    console.log(pc, files);
    e.preventDefault();
    fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/api/product/write`, {
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
        <input type="file" accept="image/*" name='files' id='files' onChange={uploadFile} multiple/>
      </div>
      <div className="mb-2">
        <span>미리보기</span>
        {files.map((file, index) => {
          <div key={index}>
            <img src={file.url} alt={`Uploaded ${index}`} style={{ width: '100px', height: '100px' }} />
          </div>
        })}
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
      <span>선택된 위치: {product.location}</span>
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
