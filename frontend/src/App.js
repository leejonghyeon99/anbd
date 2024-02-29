import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Header from "./common/Header";
import Sidebar from "./common/Sidebar";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./user/Login";
import Admin from "./admin/Admin";
import Update from "./user/Update";
import SignUp from "./user/SignUp";
import Home from "./common/Home";
import PasswordCheck from "./user/PasswordCheck";
import ListPage from "./product/page/ListPage";
import WritePage from "./product/page/WritePage";
import DetailPage from "./product/page/DetailPage";
import UpdatePage from "./product/page/UpdatePage";
import GoogleMaps from "./product/page/GoogleMaps";
import ChatPage from "./chat/page/ChatPage";
import UpdatePassword from "./user/UpdatePassword";
import { Button } from "react-bootstrap";
import MyPage from "./user/my/MyPage";


const App = () => {
  const [menuToggle, setMenuToggle] = useState(true);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setMenuToggle(!menuToggle);
  };

useEffect(() => {
    // 창 크기 변화를 감지하여 메뉴 상태를 업데이트하는 이벤트 핸들러
    const handleResize = () => {
      // 창 너비가 768px 이상인 경우 메뉴를 보이도록 설정
      // 그렇지 않으면 메뉴를 감추도록 설정
      setMenuToggle(window.innerWidth >= 768);
    };

    // 컴포넌트가 마운트될 때 초기 값 설정
    handleResize();

    // 리사이즈 이벤트에 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 정리
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  // 768px 이하인 경우 Sidebar 외의 곳을 클릭하면 닫히는 동작
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // 768px 이하인 경우에만 동작
      if (window.innerWidth < 768) {
        if (
          sidebarRef.current &&
          !sidebarRef.current.contains(event.target)
        ) {
          setMenuToggle(false);
        }
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className="AppBox">
        <div className="HeaderSidebarContainer">
          <Header className="header" />
          <div className="menu">
            <Button id="hamburger" onClick={toggleSidebar}>
              <img
                src="/icon/menu.png"
                alt="Toggle Sidebar"
              />
            </Button>
            {menuToggle && <Sidebar ref={sidebarRef} />}
          </div>
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/home"></Navigate>}></Route>
            <Route path="/home" Component={Home}></Route>
            <Route path="user/login" Component={Login}></Route>
            <Route path="user/signup" Component={SignUp}></Route>
            <Route path="user/passwordcheck" Component={PasswordCheck}></Route>
            <Route path="user/update" Component={Update}></Route>
            <Route path="/user/:id" element={<Update />} />
            <Route path="/user/mypage" element={<MyPage />} />
            <Route
              path="user/updatepassword"
              Component={UpdatePassword}
            ></Route>
            <Route path="/product/list/:sub" Component={ListPage}></Route>
            <Route path="/product/write" Component={WritePage}></Route>
            <Route path="/product/detail/:id" Component={DetailPage}></Route>
            <Route path="/product/update/:id" Component={UpdatePage}></Route>
            <Route path="/admin" Component={Admin}></Route>

            <Route path="/product/map/:id" Component={GoogleMaps}></Route>
            <Route path="/chatRoom/:id" Component={ChatPage}></Route>
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
