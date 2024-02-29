import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import "./CSS/Sidebar.css";

const Styledsidebar = styled.div`
  display: ${(props) => (props.isMenuOpen ? "block" : "none")};

  @media screen {
    display: block;
  }

  @media screen and (max-width: 767px) {
    display: flex;
    height: auto;
    padding: 15px;
    justify-content: center;
    text-align: center;
    border-radius: 4px;
    box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.3);
    z-index: 3;
    background-color: #fff;
    position: absolute;
    left: 0.3rem;
    width: 90%; // 화면 전체 너비를 차지하도록 설정
    top: 6%; // 헤더와 겹치지 않도록 조절 (필요에 따라 조절 가능)
  }
  @media screen and (max-width: 389px) {
    top: 7.5%; // 헤더와 겹치지 않도록 조절 (필요에 따라 조절 가능)
    left: 0.2rem;
  }
  @media screen and (max-width: 290px) {
    top: 10%; // 헤더와 겹치지 않도록 조절 (필요에 따라 조절 가능)
  }
`;

const SidebarMenu = styled.div`
  li {
    cursor: pointer;
  }
  .mainCategory {
    font-size: calc(9px + 0.5vw); /* m.main에 대한 글자 크기 조절 */
    font-weight: bold; /* m.main에 대한 글자 굵게 설정 */
    /* 다른 스타일링을 추가할 수 있습니다. */
  }

  .subCategory {
    font-size: calc(7px + 0.5vw); /* m.sub에 대한 글자 크기 조절 */
    /* 다른 스타일링을 추가할 수 있습니다. */
  }
`;

function Sidebar() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const [error, setError] = useState(null);

  // //중분류 상태 설정
  const [category, setCategory] = useState([]);

  // 현재 활성화된 메인 카테고리 상태
  const [activeMain, setActiveMain] = useState(null);

  // 데이터 구조를 변경하여 중복되지 않는 메인 카테고리와 서브 카테고리로 변환, 그룹화
  const transformData = (data) => {
    return Object.values(
      // reduce 함수를 사용하여 데이터를 순회하며 누적값 생성
      data.reduce((acc, currentItem) => {
        // 데이터 조회, (acc는 []로 초기화됨)
        const { main, sub } = currentItem; //(currentItem 에서 main과 sub 추출)

        if (!acc[main]) {
          // 만약 누적값에 현재 main이 없다면, 새로운 객체 생성 및 sub 배열 초기화
          acc[main] = { main, sub: [sub] };
        } else {
          // 이미 존재하는 main이라면 해당 객체의 sub 배열에 현재 sub 추가
          acc[main].sub.push(sub);
        }
        return acc; // 누적값 반환
      }, []) // 초기값으로 빈 배열을 사용
    );
  };

  // 각 메인 카테고리에 따라 토글 상태 업데이트
  const toggleSubMenu = (main) => {
    // 클릭한 메인이 이미 활성화되어 있으면 비활성화하고, 아니면 활성화
    setActiveMain((prevMain) => (prevMain === main ? null : main));
  };

  const isSubMenuOpen = (main) => {
    // 각 메인 카테고리에 따라 동적으로 상태 반환
    return main === activeMain;
  };

  // 서브 메뉴 클릭 시 해당 메뉴로 이동
  const handleSubMenuClick = (sub) => {
    // 페이지 새로고침
    navigate(`/product/list/${sub}`);
    window.location.reload();
  };

  // useEffect: 상품 카테고리 목록 (상품 x)을 불러옴
  useEffect(() => {
    const categoryGetSub = async () => {
      try {
        const url = `${apiUrl}/api/product/category/sub`;
        const response = await fetch(url);

        if (!response.ok) {
          // 만약 응답 상태가 ok가 아니면 에러를 던짐
          throw new Error(
            `데이터를 불러오는 데 실패했습니다: ${response.statusText}`
          );
        }

        const data = await response.json();

        // 서버에서 받은 데이터를 category 상태에 저장
        setCategory(transformData(data));
        setError(null); // 이전 에러를 지움
      } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생:", error);
        setError("데이터를 불러오지 못했습니다. 다시 시도해주세요."); // 에러 상태 설정
      }
    };
    categoryGetSub();
  }, [apiUrl]); // apiUrl이 업데이트되도록 의존성에 추가????하나 안하나 물어보기

  // useEffect: 상품 카테고리 목록이 업데이트될 때마다 로그 출력
  useEffect(() => {
    console.log(category);
  }, [category]);

  return (
    <Styledsidebar className="sidebarBox">
      <div className="sidebarWrapper">
        <SidebarMenu className="sidebarMenu">
          {/* 데이터를 가져오는 도중에 발생할 수 있는 오류를 나타내는 상태 */}
          {error && <div>에러: {error}</div>}

          {/* 카테고리 데이터를 순회하며 렌더링 */}
          {category.map((m) => (
            <ul key={m.main} className="menuList">
              {/* 메인 카테고리를 클릭할 때 서브 메뉴를 토글하는 함수 호출 */}
              <li onClick={() => toggleSubMenu(m.main)}>
                <span className="mainCategory">{m.main}</span>
              </li>

              {/* 서브 메뉴 렌더링 (토글 상태에 따라 보이거나 숨겨짐) */}
              {m.sub.map((s) => (
                <li
                  key={s}
                  onClick={() => handleSubMenuClick(s)}
                  style={{ display: isSubMenuOpen(m.main) ? "block" : "none" }}
                >
                  <span className="subCategory">{s}</span>
                </li>
              ))}
            </ul>
          ))}
        </SidebarMenu>
      </div>
    </Styledsidebar>
  );
}

export default Sidebar;
