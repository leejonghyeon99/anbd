import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MypagebarList } from "../components/MypagebarList";
import { AdminpagebarList } from "../components/AdminpagebarList";
import "./CSS/Header.css";
import "./CSS/Mypagebar.css";

// icon import
import { FaUserCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Container } from "react-bootstrap";
import Sidebar from "./Sidebar";

const Navbar = styled.div`
  /* 다른 스타일들... */
  display: ${(props) => (props.isvisible === "true" ? "block" : "none")};
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: #ffffff;
  transition: right 0.3s ease-in-out;
  border: 3px solid rgba(0, 0, 0, 0.466);

  @media screen and (max-width: 768px) {
    width: 50%;
  }
`;

/* .hiddenMenu 클릭 시 나타나는 NavMenu 스타일링 */
const NavMenu = styled.ul`
  display: ${(props) => (props.ismenuopen === "true" ? "block" : "none")};
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #fff;
  padding: 15px;
  box-shadow: 0px 5px 0px 0px rgba(0, 0, 0, 0.1);
  transform-origin: top;
  transform: scaleY(${(props) => (props.ismenuopen === "true" ? "1" : "0")});
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  opacity: ${(props) => (props.ismenuopen === "true" ? "1" : "0")};
  top: 60px; /* 상단 여백 조절 */

  @media screen and (max-width: 768px) {
  display: ${(props) => (props.ismenuopen === "true" ? "block" : "none")};
  border-radius: 5px;
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const headerRef = useRef(null);

  const [user, setUser] = useState({
    username: "",
    password: "",
    repassword: "",
    name: "",
    nickname: "",
    phone_number: "",
    email: "",
    region: "",
    auth: "", // 추가: 사용자 권한 정보
  });

  // 로그인 유무 상태(useEffect로 상태 확인해야함)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const getUserInfoFromToken = (token) => {
      const decodedToken = atob(token.split(".")[1]);
      const userInfo = JSON.parse(decodedToken);
      return userInfo;
    };

    const userData = async () => {
      try {
        if (token) {
          // 토큰에서 사용자 정보를 추출
          const userInfo = getUserInfoFromToken(token);

          // 사용자 정보를 상태값에 설정
          setUser(userInfo);

          // 서버에 사용자 정보 요청 보내기
          const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/user/info`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const additionalUserInfo = await response.json();
            // 서버에서 받은 추가 정보를 기존 사용자 정보에 합치기
            setUser((prevUserInfo) => ({
              ...prevUserInfo,
              ...additionalUserInfo,
            }));
          } else {
            console.error("Failed to fetch additional user info");
          }
        } else {
          // console.log("No token found, user is not logged in");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // userData 함수 실행 (컴포넌트가 마운트될 때 한 번만 실행하도록 빈 배열 전달)
    userData();
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 모든 대분류의 중분류가 따로따로 토글되도록 아래 상태함수들 줌
  const [isBclothingOpen, setIsBclothingOpen] = useState(false);
  const [isBfoodOpen, setIsBfoodOpen] = useState(false);
  const [isBlivingOpen, setIsBlivingOpen] = useState(false);
  // Mypage 버튼
  const [isMypageVisible, setIsMypageVisible] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        // 클릭된 요소가 Header 외부에 있으면 Navbar를 닫음
        setIsMypageVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMypageVisible]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // 햄버거 토글하면 대분류 모두 닫기
    setIsBclothingOpen(false);
    setIsBfoodOpen(false);
    setIsBlivingOpen(false);
    // 메뉴를 열 때 mypage는 닫힘
    setIsMypageVisible(false);
  };

  const toggleClothing = () => {
    setIsBclothingOpen(!isBclothingOpen);
    // 의류 토글 시 다른 메뉴는 닫아!!!
    setIsBfoodOpen(false);
    setIsBlivingOpen(false);
  };

  const toggleFood = () => {
    setIsBfoodOpen(!isBfoodOpen);
    // 식품 토글 시 다른 메뉴는 딷아!!!!
    setIsBclothingOpen(false);
    setIsBlivingOpen(false);
  };

  const toggleLiving = () => {
    setIsBlivingOpen(!isBlivingOpen);
    // 생활용품 토글 시 다른 메뉴는 닫아!!!!
    setIsBclothingOpen(false);
    setIsBfoodOpen(false);
  };

  // mypage show/hide
  const toggleMypage = () => {
    setIsMypageVisible(!isMypageVisible);
    setIsMenuOpen(false); // Navbar가 열려있는 경우 닫도록 설정
  };

  //Logout
  const handleLogout = () => {
    const token = localStorage.getItem("accessToken");
    console.log(token);

    if (!token) {
      console.log("No token found, user is probably not logged in");
      // 추가 처리: 사용자가 이미 로그아웃 상태임을 알림 or 로그인 페이지로 리디렉션
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=utf-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // 서버로부터의 응답을 JSON으로 파싱
        } else {
          throw new Error("로그아웃 실패");
        }
      })
      .then((data) => {
        console.log("로그아웃 성공", data.message);
        localStorage.removeItem("accessToken");
        // 페이지 새로고침
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
        console.error(error); // 오류 처리
      });
  };

  return (
    <div className="header">
      <div ref={headerRef}>
        <div className="headerBox">
          <div className="headerFix">
            <div className="hiddenMenu">
              {/* 아이콘 클릭 시 메뉴 토글 */}
              <img src="/icon/menu.png" id="menuIcon" onClick={toggleMenu} />
            </div>
            <div className="logo">
              <Link to="/home" className="goHome">
                AH!NaBaDa
              </Link>
            </div>

            {/* 로그인한 유저와 비회원의 mypage아이콘 다르게 나오도록 */}
            <div className="mypageToggle" id="menu-bars">
              {user.auth === "ROLE_USER" && (
                <img
                  src="/icon/usericon.png"
                  id="userIcon"
                  onClick={toggleMypage}
                />
              )}
              {user.auth === "ROLE_ADMIN" && (
                <img
                  src="/icon/admin.png"
                  id="adminIcon"
                  onClick={toggleMypage}
                />
              )}
              {user.auth !== "ROLE_USER" && user.auth !== "ROLE_ADMIN" && (
                <div>
                  <Link to="user/login">LOGIN</Link>{" "}
                  <Link to="user/signup">JOIN</Link>
                </div>
              )}
            </div>
          </div>

          <Navbar isvisible={isMypageVisible.toString()} id="navbar">
            {" "}
            {/* Navbar의 isVisible 속성에 따라 보이거나 숨김 */}
            <nav className="nav-menu">
              <li className="navbar-toggle">
                <img
                  src="/icon/Xmark.png"
                  className="closeMypage"
                  onClick={toggleMypage}
                />
              </li>
              <div className="mypage_nickname">
                <p>
                  ID: {user.username}
                  <br />
                  닉네임: {user.nickname}
                </p>
              </div>
              <div>
                <Link to={"user/passwordcheck"} className="moveToUpdate" onClick={toggleMypage}>
                  <small>회원정보수정</small>
                </Link>
              </div>
              <div className="profile">
                <img src="/icon/userIcon.png" className="profileImg"></img>
              </div>

              <div className="mypage_auth">
                {user.auth === "ROLE_USER" && (
                  <div className="userbar">
                    <Link
                      to={"/chat/:id"}
                      className="chattingBtn"
                      onClick={toggleMypage}
                    >
                      <img
                        src="/icon/chatting.png"
                        className="chatIcon_mp"
                      ></img>
                    </Link>

                    <div>
                      <ul className="nav-menu-items">
                        {MypagebarList.map((item, index) => (
                          <li key={index} className={item.cName} id="menuTitle">
                            <Link
                              to={item.path}
                              className="mypageList"
                              onClick={toggleMypage}
                            >
                              {item.icon} <span>{item.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {user.auth === "ROLE_ADMIN" && (
                  <div className="adminbar">
                    <ul>
                      {AdminpagebarList.map((item, index) => (
                        <li key={index} className={item.cName} id="menuTitle">
                          <Link
                            to={item.path}
                            className="mypageList"
                            onClick={toggleMypage}
                          >
                            {item.icon} <span>{item.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </nav>
            {/*로그아웃 버튼!! */}
            <Link>
              <img
                src="/icon/logout.png"
                className="logout"
                onClick={handleLogout}
              />
            </Link>
          </Navbar>
        </div>


        {/* isMenuOpen 값에 따라 Sidebar가 보이도록 설정 */}
        {isMenuOpen && (
          <NavMenu ismenuopen={isMenuOpen.toString()}>
            <Sidebar />
          </NavMenu>
        )}
      </div>
    </div>
  );
};

export default Header;
