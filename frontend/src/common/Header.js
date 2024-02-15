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
`;

const Header = () => {
  const [user, setUser] = useState(null); // 로그인 유무 상태(useEffect로 상태 확인해야함)

  const navigate = useNavigate();

  useEffect(() => {
    // useEffect 훅 안에서 비동기 함수를 정의하고 로그인 상태를 확인하는 함수
    const checkLoggedIn = async () => {
      try {
        // 서버에 로그인 상태를 확인하기 위한 요청 보냄
        const response = await fetch("/api/user/checkLoggedIn");
        // 서버에서 받은 응답 데이터를 JSON 형식으로 파싱합니다.
        const userData = await response.json();
        // 서버에서 받은 사용자 데이터로 상태를 설정합니다. 
        // setUser 함수를 호출하여 사용자 데이터를 user 상태에 저장합니다.
        setUser(userData);
      } catch (error) {
        // 오류가 발생한 경우 콘솔에 오류 메시지를 출력합니다.
        console.error("Error checking logged in status:", error);
      }
    };
  
    // 컴포넌트가 처음으로 렌더링될 때 한 번만 실행되도록 useEffect 안에서 checkLoggedIn 함수를 호출합니다.
    checkLoggedIn();
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
  };

  return (
    <div className="header">
      <StyledHeader>
        <div className="headerBox">
          <div className="headerFix">
            <div className="hiddenMenu">
              {/* 아이콘 클릭 시 메뉴 토글 */}
              <img src="icon/menu.png" id="menuIcon" onClick={toggleMenu} />
            </div>
            <Link to="/home" className="logo">
              AH!NaBaDa
            </Link>

            {/* 로그인한 유저와 비회원의 mypage아이콘 다르게 나오도록 */}
            {user ? (
              <div className="mypageToggle" id="menu-bars">
                <img
                  src="icon/usericon.png"
                  id="userIcon"
                  onClick={toggleMypage}
                />
              </div>
            ) : (
              <div className="mypageToggle" id="menu-bars">
                <Link to="user/login">LOGIN</Link>{" "}
                <Link to="user/signup">JOIN</Link>
              </div>
            )}
          </div>

          <Navbar isVisible={isMypageVisible}>
            {" "}
            {/* user아이콘 토글하면 나오는 메뉴 */}
            <nav className="nav-menu">
              <ul className="nav-menu-items">
                <li className="navbar-toggle">
                  <Link to="#" id="menu-bars" onClick={toggleMypage}>
                    <IoClose />
                  </Link>
                </li>
                {MypagebarList.map((item, index) => (
                  <li key={index} className={item.cName} id="menuTitle">
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Navbar>
        </div>

        <NavMenu isMenuOpen={isMenuOpen}>
          <ul onClick={toggleClothing}>
            의류
            {isBclothingOpen && (
              <ul className="submenu">
                <li onClick={() => navigate()}>여성의류</li>
                <li onClick={() => navigate()}>남성의류</li>
                <li onClick={() => navigate()}>아동의류</li>
              </ul>
            )}
          </ul>
          <ul onClick={toggleFood}>
            식품
            {isBfoodOpen && (
              <ul className="submenu">
                <li onClick={() => navigate()}>1</li>
                <li onClick={() => navigate()}>2</li>
                <li onClick={() => navigate()}>3</li>
              </ul>
            )}
          </ul>
          <ul onClick={toggleLiving}>
            생활용품
            {isBlivingOpen && (
              <ul className="submenu">
                <li onClick={() => navigate()}>1</li>
                <li onClick={() => navigate()}>2</li>
                <li onClick={() => navigate()}>3</li>
              </ul>
            )}
          </ul>
        </NavMenu>
      </StyledHeader>
    </div>
  );
};

export default Header;
