import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import "./CSS/Header.css";

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

const StyledMypage = styled.div`
  img {
    max-width: 50vw; /* 최대 너비를 화면의 50px로 설정 */
    height: auto; /* 이미지의 가로 세로 비율 유지 */
  }
`;

const StyledMypagebar = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  right: ${(props) =>
    props.isOpen
      ? "0"
      : "-300px"}; /* isOpen 상태에 따라 오른쪽에서 나타나거나 사라짐 */
  height: 100vh;
  width: 300px;
  background-color: #ffffff;
  transition: right 0.3s ease; /* 부드럽게 이동되도록 트랜지션 설정 */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Header = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 모든 대분류의 중분류가 따로따로 토글되도록 아래 상태함수들 줌
  const [isBclothingOpen, setIsBclothingOpen] = useState(false);
  const [isBfoodOpen, setIsBfoodOpen] = useState(false);
  const [isBlivingOpen, setIsBlivingOpen] = useState(false);
  // 마이페이지 버튼 토글
  const [isMypageOpen, setIsMypageOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // 햄버거 토글하면 대분류 모두 닫기
    setIsBclothingOpen(false);
    setIsBfoodOpen(false);
    setIsBlivingOpen(false);
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

  const toggleMypage = () => {
    // 마이페이지 사이드바 열기
    setIsMypageOpen(!isMypageOpen);
  };

  const closeMypage = () => {
    setIsMypageOpen(false);
  };

  const handleOutsideClick = (event) => {
    if (!event.target.closest("#mypagebar")) {
      closeMypage();
    }
  };

  return (
    <div className="header">
      <StyledHeader>
        <div className="header_fix">
          <div className="nav_logo">
            {/* 아이콘 클릭 시 메뉴 토글 */}
            <img src="icon/menu.png" id="menuIcon" onClick={toggleMenu} />
            AH!NaBaDa
          </div>
          <StyledMypage className="mypage">
            <img
              src="icon/usericon.png"
              id="mypagebtn"
              onClick={toggleMypage}
            />
          </StyledMypage>
          {isMypageOpen && (
            <div onClick={handleOutsideClick}>
              <StyledMypagebar id="mypagebar" isOpen={isMypageOpen}>
                <CloseButton onClick={closeMypage}>X</CloseButton>
                {/* 사이드바 내용 */}
                <li onClick={toggleClothing}>대시보드</li>
              </StyledMypagebar>
            </div>
          )}
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
