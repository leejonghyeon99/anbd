import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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
  display: ${(props) => (props.isMenuOpen ? 'block' : 'none')};
  flex-direction: column;
  align-items: center;
  width: 100%;

  @media screen and (max-width: 768px) {
    display: ${(props) => (props.isMenuOpen ? 'block' : 'none')};
  }
`;

const Header = () => {
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // 모든 대분류의 중분류가 따로따로 토글되도록 아래 상태함수들 줌
    const [isClothingOpen, setIsClothingOpen] = useState(false);
    const [isFoodOpen, setIsFoodOpen] = useState(false);
    const [isLivingOpen, setIsLivingOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        // 햄버거 토글하면 대분류 모두 닫기
        setIsClothingOpen(false);
        setIsFoodOpen(false);
        setIsLivingOpen(false);
    };

    const toggleClothing = () => {
        setIsClothingOpen(!isClothingOpen);
        // 의류 토글 시 다른 메뉴는 닫아!!!
        setIsFoodOpen(false);
        setIsLivingOpen(false);
    };

    const toggleFood = () => {
        setIsFoodOpen(!isFoodOpen);
        // 식품 토글 시 다른 메뉴는 딷아!!!!
        setIsClothingOpen(false);
        setIsLivingOpen(false);
    };

    const toggleLiving = () => {
        setIsLivingOpen(!isLivingOpen);
        // 생활용품 토글 시 다른 메뉴는 닫아!!!!
        setIsClothingOpen(false);
        setIsFoodOpen(false);
    };

    return (
        <>
            <StyledHeader>
                <div className="nav_logo">
                    {/* 아이콘 클릭 시 메뉴 토글 */}
                    <img src="icon/menu.png" id="menuIcon" onClick={toggleMenu} />
                    AH!NaBaDa
                </div>

                <NavMenu isMenuOpen={isMenuOpen}>
                    <ul onClick={toggleClothing}>
                        의류
                        {isClothingOpen && (
                            <ul className="submenu">
                                <li onClick={() => navigate()}>여성의류</li>
                                <li onClick={() => navigate()}>남성의류</li>
                                <li onClick={() => navigate()}>아동의류</li>
                            </ul>
                        )}
                    </ul>
                    <ul onClick={toggleFood}>
                        식품
                        {isFoodOpen && (
                            <ul className="submenu">
                                <li onClick={() => navigate()}>1</li>
                                <li onClick={() => navigate()}>2</li>
                                <li onClick={() => navigate()}>3</li>
                            </ul>
                        )}
                    </ul>
                    <ul onClick={toggleLiving}>
                        생활용품
                        {isLivingOpen && (
                            <ul className="submenu">
                                <li onClick={() => navigate()}>1</li>
                                <li onClick={() => navigate()}>2</li>
                                <li onClick={() => navigate()}>3</li>
                            </ul>
                        )}
                    </ul>
                </NavMenu>

                <div>
                    <Link to="/saveForm" className="nav-link">
                        <img src="icon/usericon.png" id="mypagebtn" />
                    </Link>
                </div>
            </StyledHeader>
        </>
    );
};

export default Header;