import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";

const Styledsidebar = styled.div`
  display: ${(props) => (props.isMenuOpen ? "block" : "none")};
  flex: 1;
  height: calc(100vh - 120px);
  background-color: blueviolet;
  position: sticky;
  top: 50px;
  padding: 15px;

  @media screen and (min-width: 768px) {
    display: block;
  }
`;

const SidebarMenu = styled.div`
  ul {
    list-style: none;
    font-size: calc(8px + 0.8vw); /* vw 단위를 사용하여 글꼴 크기를 동적으로 변경 */
    padding: 0;
    margin: 0;
  }

  li {
    font-size: calc(8px + 0.5vw); /* vw 단위를 사용하여 글꼴 크기를 동적으로 변경 */
    cursor: pointer;
  }
`;

function Sidebar() {
  const navigate = useNavigate();

  // 모든 대분류의 중분류가 따로따로 토글되도록 아래 상태함수들 줌
  const [isClothingOpen, setIsClothingOpen] = useState(false);
  const [isFoodOpen, setIsFoodOpen] = useState(false);
  const [isLivingOpen, setIsLivingOpen] = useState(false);

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
    <Styledsidebar>
      <div className="sidebarWrapper">
        <SidebarMenu className="sidebarMenu">
          <ul onClick={toggleClothing}>
            의류
            {isClothingOpen && (
              <ul className="submenu">
                <li onClick={() => navigate("/product/list")}>여성의류</li>
                <li onClick={() => navigate("/product/list")}>남성의류</li>
                <li onClick={() => navigate("/product/list")}>아동의류</li>
              </ul>
            )}
          </ul>
          <ul onClick={toggleFood}>
            식품
            {isFoodOpen && (
              <ul className="submenu">
                <li onClick={() => navigate("/product/list")}>1</li>
                <li onClick={() => navigate("/product/list")}>2</li>
                <li onClick={() => navigate("/product/list")}>3</li>
              </ul>
            )}
          </ul>
          <ul onClick={toggleLiving}>
            생활용품
            {isLivingOpen && (
              <ul className="submenu">
                <li onClick={() => navigate("/product/list")}>1</li>
                <li onClick={() => navigate("/product/list")}>2</li>
                <li onClick={() => navigate("/product/list")}>3</li>
              </ul>
            )}
          </ul>
        </SidebarMenu>
      </div>
    </Styledsidebar>
  );
}

export default Sidebar;
