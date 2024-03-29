import React, { useEffect, useState } from "react";
import { Button, Image, Col, Carousel } from "react-bootstrap";
import { Link, json, useNavigate, useParams } from "react-router-dom";
import { fetchWithToken } from "../../user/Reissue";
import { upload } from "@testing-library/user-event/dist/upload";
import { jwtDecode } from "jwt-decode";
import "../CSS/DetailPage.css";
import ChatComponent from "../../chat/component/ChatComponent";
import GoogleMaps from "./GoogleMaps";

const DetailPage = () => {
  const navigate = useNavigate();

  let { id } = useParams();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [product, setProduct] = useState({
    id: "",
    title: "",
    description: "",
    refreshedAt: "",
    price: "",
    user: "",
    category: {
      sub: "",
    },
    location: "",
    userName: "",
    fileList: [],
  });

  const [selectFiles, setSelectFiles] = useState("");
  const [mapLocation, setMapLocation] = useState(null);
  const [username, setUsername] = useState();
  const [userrole, setUserrole] = useState();

  const UpdateOk = () => {
    navigate("/product/update/" + id);
  };

  // 리스트 페이지 이동
  const ListOk = () => {
    navigate("/product/list/" + product.category.sub);
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product/detail/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        // 상품 위치 정보가 있는 경우, 지도 위치를 설정합니다.
        if (data.location) {
          // 예를 들어, data.location 형식이 "lat,lng" 문자열이라고 가정
          const [lat, lng] = data.location.split(",").map(Number);
          setMapLocation({ lat, lng });
        }
      });
  }, []);

  function GoogleMaps({ location, zoom }) {
    useEffect(() => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: location,
        zoom: zoom,
      });

      new window.google.maps.Marker({
        position: location,
        map: map,
      });
    }, [location, zoom]);

    return <div id="map" style={{ height: "100%", width: "100%" }}></div>;
  }

  const DeleteOk = () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    fetchWithToken(
      `${process.env.REACT_APP_API_BASE_URL}/api/product/delete/` + id,
      {
        method: "DELETE",
      }
    )
      .then((response) => response.text())
      .then((data) => {
        if (data !== "FAIL") {
          alert("삭제 성공");
          navigate("/product/list/" + product.category.sub);
        } else {
          alert("삭제 실패");
        }
      });
  };

  // 로컬 스토리지에서 JWT 토큰을 가져옵니다.
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (token) {
      // 토큰을 디코드하여 사용자 정보를 추출합니다.
      const decoded = jwtDecode(token);
      console.log(decoded); // 디코드된 토큰의 내용을 확인
      // 디코드된 정보에서 사용자 ID를 가져와 상태에 저장합니다.
      // 사용자 ID가 어떤 필드에 저장되어 있는지는 토큰 생성 방식에 따라 달라질 수 있습니다.
      setUsername(decoded.username || decoded.sub); // 'sub'는 JWT에서 일반적으로 사용자를 나타내는 필드입니다.
      setUserrole(decoded.auth);
    }
  }, [token]);

  // 현재 로그인한 사용자의 ID를 localStorage에서 가져옵니다.
  const currentUsername = username;
  console.log(
    "currentUsername",
    currentUsername,
    "product.userName",
    product.userName
  );

  return (
    <div className="detail_box">
      {/* 작성자 */}
      <div id="detail-userbox" className="mb-3">
        <div className="detail-user">{product.user}</div>
      </div>

      {/* 제목 */}
      <div>
        <div className="detail-title">{product.title}</div>
      </div>
      {/* 카테고리 작게 */}
      <div className="mb-3">
        <div className="detail-category">
          <small>{product.category.sub}</small>
        </div>
      </div>
      {/*가격 */}
      <div className="mb-3">
        <div className="detail-price">
          {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원
        </div>
      </div>

      {/* 첨부파일 */}
      <div className="container mt-3 mb-3 border rounded" id="photo-box">
          <Carousel id="photo">
            {product.fileList.map((productImage, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block"
                  src={`${apiUrl}/upload/product/${productImage.photoName}`}
                  alt={`상품 이미지 ${index + 1}`}
                />
              </Carousel.Item>
            ))}
          </Carousel>
      </div>

      {/* 설명 */}
      <div className="mb-3">
        <div id="detail-description" className="form-control">
          {product.description}
        </div>
      </div>

      {/* Google 지도 컴포넌트를 렌더링합니다. */}
      {mapLocation && (
        <div
          className="google-map-container"
          style={{ height: "300px", width: "100%" }}
        >
          <GoogleMaps location={mapLocation} zoom={15} />
        </div>
      )}

      <div className="mb-3">
        {(userrole === "ROLE_USER" || userrole === "ROLE_ADMIN") &&
          product.userName !== username && (
            <Link to={`/chat`} state={{ product: product }}>
              <Button id="productChat-btn">
                <img src="/icon/colorChat.png" className="chatIcon_dp" />
              </Button>
            </Link>
          )}
      </div>
      <div className="mb-3">
        {currentUsername === product.userName && (
          <Button variant="outline-dark me-2" onClick={UpdateOk}>
            수정
          </Button>
        )}
        {currentUsername === product.userName && (
          <Button variant="outline-dark me-2" onClick={DeleteOk}>
            삭제
          </Button>
        )}

        <Button variant="outline-dark me-2 float-end" onClick={ListOk}>
          목록
        </Button>
      </div>
    </div>
  );
};

export default DetailPage;
