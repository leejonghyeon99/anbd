import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MypagebarList } from "../components/MypagebarList";
import "./CSS/Header.css";
import "./CSS/Mypagebar.css";
// icon import
import { FaUserCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Container } from "react-bootstrap";

const StyledHeader = styled.header`
  /* 다른 스타일들... */
  #menuIcon {
    display: none;
  }

  @media screen and (max-width: 768px) {
    #menuIcon {
      display: inline-block;
      width: 30px;
    }
  }
`;

const NavMenu = styled.ul`
  /* 다른 스타일들... */
  display: ${(props) => (props.isMenuOpen ? "block" : "none")};
  flex-direction: column;
  align-items: center;
  width: 100%;

  @media screen and (max-width: 768px) {
    display: ${(props) => (props.isMenuOpen ? "block" : "none")};
  }
`;

const Navbar = styled.div`
  /* 다른 스타일들... */
  display: ${(props) => (props.isVisible ? "block" : "none")};
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: calc(100vh - 24px);
  background-color: #ffffff;
  transition: right 0.3s ease-in-out;

  @media screen and (max-width: 768px) {
    width: 50%;
  }
`;

const Header = () => {
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_BASE_URL;
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
    const token = localStorage.getItem('accessToken'); 

    // 함수: JWT 디코딩하여 사용자 정보 추출
    const getUserInfoFromToken = (token) => {
      // JWT는 Base64로 인코딩된 세 부분으로 나뉨: Header, Payload, Signature
      // 여기서는 Payload의 두 번째 부분을 디코딩하여 JSON 객체로 파싱
      const decodedToken = atob(token.split('.')[1]);
      const userInfo = JSON.parse(decodedToken);
      // 디코딩된 Payload에서 사용자 정보를 반환
      return userInfo;
    };

    const token = localStorage.getItem('accessToken');

    const userData = async () => {
      try {
        // accessToken에서 사용자 정보를 추출
        const userInfo = getUserInfoFromToken(token);
        // 사용자 정보를 상태값에 설정
        setUser(userInfo);
        console.log(userInfo);
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

  // 로그아웃
  const handleLogout = ()=> {
    const token = localStorage.getItem('accessToken');
    console.log(token);

    if (!token) {
      console.log('No token found, user is probably not logged in');
      // 추가 처리: 사용자가 이미 로그아웃 상태임을 알림 or 로그인 페이지로 리디렉션
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/logout`,{
      method: 'POST',
      headers:{
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
    .then(response => {
      if (response.ok) {
        return response.json(); // 서버로부터의 응답을 JSON으로 파싱
      } else {
        throw new Error('로그아웃 실패');
      }
    })
    .then(data => {
      console.log('로그아웃 성공', data.message);
      localStorage.removeItem('accessToken');
      navigate('')
    })
    .catch(error => {
      console.error(error); // 오류 처리
    });


  }

  return (
    <div className="header">
      <StyledHeader>
        <div className="headerBox">
          <div className="headerFix">
            <div className="hiddenMenu">
              {/* 아이콘 클릭 시 메뉴 토글 */}
              <img src="/icon/menu.png" id="menuIcon" onClick={toggleMenu} />
            </div>
            <Link to="/home" className="logo">
              AH!NaBaDa
            </Link>

            {/* 로그인한 유저와 비회원의 mypage아이콘 다르게 나오도록 */}
            <div className="mypageToggle" id="menu-bars">
              {/* <img
                src="/icon/usericon.png"
                id="userIcon"
                onClick={toggleMypage}
              /> */}
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

          <Navbar isVisible={isMypageVisible}>
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
              <div className="profile">
                <img src="/icon/userIcon.png" className="profileImg"></img>
              </div>
              <li>
                <Link to={"/"}>
                  <img src="/icon/chatting.png" className="chatIcon_mp"></img>
                </Link>
              </li>
              <ul className="nav-menu-items">
                {MypagebarList.map((item, index) => (
                  <li key={index} className={item.cName} id="menuTitle">
                    <Link to={item.path} className="mypageList">
                      {item.icon} <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <img src="icon/logout.png" className="logout" onClick={handleLogout}></img>

          </Navbar>
        </div>

        <NavMenu isMenuOpen={isMenuOpen}>
          <ul onClick={toggleClothing}>
            의류
            {isBclothingOpen && (
              <ul className="submenu">
                <li onClick={() => navigate("/product/list")}>여성의류</li>
                <li onClick={() => navigate("/product/list")}>남성의류</li>
                <li onClick={() => navigate("/product/list")}>아동의류</li>
              </ul>
            )}
          </ul>
          <ul onClick={toggleFood}>
            식품
            {isBfoodOpen && (
              <ul className="submenu">
                <li onClick={() => navigate("/product/list")}>1</li>
                <li onClick={() => navigate("/product/list")}>2</li>
                <li onClick={() => navigate("/product/list")}>3</li>
              </ul>
            )}
          </ul>
          <ul onClick={toggleLiving}>
            생활용품
            {isBlivingOpen && (
              <ul className="submenu">
                <li onClick={() => navigate("/product/list")}>1</li>
                <li onClick={() => navigate("/product/list")}>2</li>
                <li onClick={() => navigate("/product/list")}>3</li>
              </ul>
            )}
          </ul>
        </NavMenu>
      </StyledHeader>
    </div>
  );
};

export default Header;
