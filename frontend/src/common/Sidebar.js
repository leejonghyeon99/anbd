import React, { useEffect, useState } from "react";
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
    font-size: calc(
      8px + 0.8vw
    ); /* vw 단위를 사용하여 글꼴 크기를 동적으로 변경 */
    padding: 0;
    margin: 0;
  }

  li {
    cursor: pointer;
  }
  .mainCategory {
    font-size: calc(10px + 0.5vw); /* m.main에 대한 글자 크기 조절 */
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

    // 현재 선택된 서브 메뉴
    const [selectedSub, setSelectedSub] = useState(null);

  // 모든 대분류의 중분류가 따로따로 토글되도록 아래 상태함수들 줌
  const [isClothingOpen, setIsClothingOpen] = useState(false);
  const [isFoodOpen, setIsFoodOpen] = useState(false);
  const [isLivingOpen, setIsLivingOpen] = useState(false);

  // 데이터 구조를 변경하여 중복되지 않는 메인 카테고리와 서브 카테고리로 변환, 그룹화
  const transformData = (data) => {
    return Object.values(
      data.reduce((acc, currentItem) => {
        // 데이터 조회, (acc는 []로 초기화됨)
        const { main, sub } = currentItem; //(currentItem 에서 main과 sub 추출)
        if (!acc[main]) {
          acc[main] = { main, sub: [sub] };
        } else {
          acc[main].sub.push(sub);
        }
        return acc;
      }, [])
    );
  };

  // 각 메인 카테고리에 따라 토글 상태 업데이트
  const toggleSubMenu = (main) => {
    // 각 메인 카테고리에 따라 토글 상태 업데이트
    switch (main) {
      case "의류":
        setIsClothingOpen(!isClothingOpen);
        setIsFoodOpen(false);
        setIsLivingOpen(false);
        break;
      case "식품":
        setIsFoodOpen(!isFoodOpen);
        setIsClothingOpen(false);
        setIsLivingOpen(false);
        break;
      case "생활용품":
        setIsLivingOpen(!isLivingOpen);
        setIsClothingOpen(false);
        setIsFoodOpen(false);
        break;
      default:
        break;
    }
  };

  // 현재 어떤 메인 카테고리의 서브 메뉴가 열려 있는지 확인
  const isSubMenuOpen = (main) => {
    switch (main) {
      case "의류":
        return isClothingOpen;
      case "식품":
        return isFoodOpen;
      case "생활용품":
        return isLivingOpen;
      default:
        return false;
    }
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
    <Styledsidebar>
      <div className="sidebarWrapper">
        <SidebarMenu className="sidebarMenu">

          {/* 데이터를 가져오는 도중에 발생할 수 있는 오류를 나타내는 상태 */}
          {error && <div>에러: {error}</div>}

          {/* 카테고리 데이터를 순회하며 렌더링 */}
          {category.map((m) => (
            <ul key={m.main}>

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
                  <span className={m.sub}>{s}</span>
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
