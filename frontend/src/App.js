import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Header from "./common/Header";
import Sidebar from "./common/Sidebar";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
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
import { jwtDecode } from "jwt-decode";
import { fetchWithToken } from "./user/Reissue";
import MonthSignUp from "./admin/component/MonthSignUp";
import DailySignUp from "./admin/component/DailySignUp";
import UserList from "./admin/component/UserList";

const App = () => {
  const [menuToggle, setMenuToggle] = useState(true);
  const sidebarRef = useRef(null)
  const location = useLocation();
  
  const toggleSidebar = () => {
    setMenuToggle(!menuToggle);
  };

  const isMenuVisible = !location.pathname.endsWith('/admin');
  
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
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          setMenuToggle(false);
        }
      }
    };
    
    document.addEventListener("click", handleOutsideClick);
    
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  
  // 엑세스 토큰에서 유저 권한, username 가져오기
  function useTokenInfo() {
    const token = localStorage.getItem("accessToken");
    
    if (!token) return { isAuthenticated: false };
    
    try {
      const decoded = jwtDecode(token);
      return {
        isAuthenticated: true,
        userRole: decoded.auth,
        userName: decoded.sub,
      };
    } catch (error) {
      console.error("Token decode error:", error);
      return { isAuthenticated: false };
    }
  }

  // 애플리케이션 초기화 시 로컬 스토리지의 토큰에서 username을 동기적으로 추출하여 초기 상태 설정
  // 새로고침 에러를 막기 위해 작성
  const initialUserInfo = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return { username: decoded.sub }; // 디코드된 토큰에서 username 반환
      } catch (error) {
        console.error("Token decode error:", error);
        return null; // 디코드 중 에러 발생 시 null 반환
      }
    }
    return null; // 토큰이 없는 경우 null 반환
  };

  const [userInfo, setUserInfo] = useState(initialUserInfo);
  
  // 토큰으로 유저 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await fetchWithToken(
            `${process.env.REACT_APP_API_BASE_URL}/api/user/info`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setUserInfo({ username: data.username }); // userInfo를 객체로 설정
          console.log("app.js : "+ data.username);
        } catch (error) {
          console.error("userInfo error", error);
        }
      }
    };
    fetchUserInfo();
  }, []);


  // 조건부 라우팅을 위한 컴포넌트
  function PrivateRoute({ allowedRoles, userInfo }) {
    const { isAuthenticated, userRole, userName } = useTokenInfo();
    // console.log(userName, userInfo.username); // 확인용, 비회원으로 접근 시 여기서 에러납니다.
    console.log(`isAuthenticated: ${isAuthenticated}, userRole: ${userRole}, userName: ${userName}, userInfo.username: ${userInfo.username}`);


    if (!isAuthenticated) {
      return <Navigate to="/user/login" />;
    }

    if (allowedRoles.includes(userRole)) {
      if (
        (userRole === "ROLE_USER" && userName === userInfo.username) ||
        (userRole === "ROLE_ADMIN" && userName === userInfo.username)
      ) {
        return <Outlet />; // 자식 컴포넌트로 리턴
      } else {
        return <Navigate to="/home" />;
      }
    } else {
      return <Navigate to="/home" />;
    }
  }

  return (
    <>
      <div className="AppBox">
        <div className="HeaderSidebarContainer">
          <Header className="header" />
          <div className="menu">
            <Button id="hamburger" onClick={toggleSidebar}>
              <img src="/icon/menu.png" alt="Toggle Sidebar" />
            </Button>
            {isMenuVisible && menuToggle && <Sidebar ref={sidebarRef} />}
          </div>
        </div>
        <div className="content">
          <Routes>
            {/* 권한 없이 접근 가능 */}
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="user/login" element={<Login />} />
            <Route path="user/signup" element={<SignUp />} />
            <Route path="/product/list/:sub" element={<ListPage />} />
            <Route path="/product/detail/:id" element={<DetailPage />} />

            {/* 유저 권한 접근 가능 */}
            <Route
              element={
                <PrivateRoute
                  allowedRoles={["ROLE_USER"]}
                  userInfo={userInfo}
                />
              }
            >
              <Route path="/user/passwordcheck" element={<PasswordCheck />} />
              <Route path="/user/update" element={<Update />} />
              <Route path="/user/updatepassword" element={<UpdatePassword />} />
              <Route path="/user/mypage" element={<MyPage />} />
              <Route path="/product/write" element={<WritePage />} />
              <Route path="/product/update/:id" element={<UpdatePage />} />
              <Route path="/product/map/:id" element={<GoogleMaps />} />
              <Route path="/chat" element={<ChatPage />} />
            </Route>

            {/* 관리자 권한 접근 가능 */}
            <Route
              element={
                <PrivateRoute
                  allowedRoles={["ROLE_ADMIN"]}
                  userInfo={userInfo}
                />
              }
            >
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/monthsignup" element={<MonthSignUp />} />
              <Route path="/admin/dailysingup" element={<DailySignUp />} />
              <Route path="/admin/userlist" element={<UserList />} />
              <Route path="/user/passwordcheck" element={<PasswordCheck />} />
              <Route path="/user/update" element={<Update />} />
              <Route path="/user/updatepassword" element={<UpdatePassword />} />
              <Route path="/user/mypage" element={<MyPage />} />
              <Route path="/product/write" element={<WritePage />} />
              <Route path="/product/update/:id" element={<UpdatePage />} />
              <Route path="/product/map/:id" element={<GoogleMaps />} />
              <Route path="/chat" element={<ChatPage />} />

            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
