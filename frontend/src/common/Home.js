import React, { useState } from "react";
import "./CSS/Home.css";

const Home = () => {


  return (
  // 부트스트랩 컨테이너를 생성하고 ID를 부여하여 CSS 스타일을 적용할 수 있습니다.
  <div className="container-fluid" id="homeView">
    {/* 부트스트랩의 행 클래스를 사용하여 가운데 정렬된 행을 생성합니다. */}
    <div className="row justify-content-center align-items-center">
      {/* 첫 번째 열(col-md-6)에는 Slogan 이미지가 들어갑니다. order-md-1은 중간 크기 화면에서의 순서를 지정합니다. */}
      <div className="col-md-6 order-md-1" id="slogan">
        <img src="/img/slogan1.png" className="img-fluid" alt="Slogan Image" />
      </div>
      {/* 두 번째 열(col-md-6)에는 Main 이미지가 들어갑니다. order-md-2는 중간 크기 화면에서의 순서를 지정합니다. */}
      <div className="col-md-6 order-md-2" id="main">
        <img src="/img/mainFinal.png" className="img-fluid" alt="Main Image" />
      </div>
    </div>
  </div>
  );
};

export default Home;
