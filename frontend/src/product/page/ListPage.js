import React, { useEffect, useState } from "react";
import { Button, Col, Form, FormControl, Row } from "react-bootstrap";
import ProductItem from "../components/ProductItem";
import { useNavigate, useParams } from "react-router-dom";
import "../CSS/ListPage.css";

const ListPage = () => {
  const navigate = useNavigate();

  const { sub } = useParams(); // URL에서 중분류(sub) 파라미터 가져오기
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const [initialProducts, setInitialProducts] = useState([]); // 초기 상품 목록을 저장하는 변수 추가
  const [products, setProducts] = useState([]); // 전체 상품 목록 상태
  const [search, setSearch] = useState(""); // 검색어 상태
  const [searchMessage, setSearchMessage] = useState(""); // 검색 결과 메시지 상태
  const [statusFilter, setStatusFilter] = useState(""); // 상태 필터링 상태

  useEffect(() => {
    // 상품목록
    // //중분류 이름으로 목록
    const getProductListBySub = async () => {
      try {
        const url = `${apiUrl}/api/product/list/${sub}`;
        const response = await fetch(url);
        const data = await response.json();

        // 서버에서 받은 데이터를 category 상태에 저장
        setProducts(data);
        // 초기 상품 목록 저장(말머리 필터링 위해)
        setInitialProducts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getProductListBySub();
  }, [sub]); // sub가 변경될 때마다 useEffect 실행

  useEffect(() => {
    console.log(products);
  }, [products]);
  console.log(sub);

  // 검색어가 변경될 때마다 실행되는 이벤트 핸들러
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // 검색어 제출 시 실행되는 이벤트 핸들러
  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    console.log(search);

    try {
      const url = `${apiUrl}/api/product/list/${sub}?search=${search}`;
      const response = await fetch(url);
      const data = await response.json();
      // 검색어가 포함된 title을 가진 product만 필터링
      const searchedProducts = data.filter((product) =>
        product.title.includes(search)
      );

      // 결과가 없을 때 빈 목록으로 설정
      if (searchedProducts.length === 0) {
        // 검색 결과가 없다는 메시지를 사용자에게 알리기
        setSearchMessage("검색된 목록이 없습니다.");
      } else {
        setSearchMessage(""); // 결과가 있으면 메시지 초기화
      }
      // 검색 결과에 상태 필터링 적용
      applyStatusFilter(searchedProducts);
    } catch (error) {
      console.error("상품 검색 오류:", error);
    }
  };

  // 상태 필터링 핸들러
  const handleStatusFilter = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    // 상태 필터링 적용
    applyStatusFilter(initialProducts, status);
  };

  // 상태 필터링 적용 함수
  const applyStatusFilter = (filteredProducts, status = statusFilter) => {
    // 선택된 상태가 없으면 초기 상품 목록 사용
    if (!status) {
      setProducts(filteredProducts);
      return;
    }
    // 선택된 상태에 따라 상품 필터링
    let filtered = [];
    switch (status) {
      case "SALE":
        filtered = filteredProducts.filter((product) => product.status === "SALE");
        break;
      case "RESERVED":
        filtered = filteredProducts.filter((product) => product.status === "RESERVED");
        break;
      case "SOLD":
        filtered = filteredProducts.filter((product) => product.status === "SOLD");
        break;
      default:
        filtered = [...filteredProducts];
        break;
    }
    setProducts(filtered);
  };

  // 새 상품 등록 페이지로 이동하는 함수
  const WriteOk = () => {
    navigate("/product/write");
  };

  return (
    <div className="ListPageBox">
      <div className="list-title">
        <span> {sub} 판매 목록</span>
      </div>

      <div className="list-headerBox">
        <div className="list-addBtn">
          {/* 상품 등록 버튼 */}
          {localStorage.getItem("accessToken") && (
            <Button
              id="write-button"
              variant="outline-dark mt-3"
              onClick={WriteOk}
            >
              <span className="button-text">
                <img src="/icon/put.png" />
              </span>
            </Button>
          )}
        </div>

        <div className="status-filter">
          <Form.Select onChange={handleStatusFilter}>
            <option value="">전체</option>
            <option value="SALE">판매중</option>
            <option value="RESERVED">예약중</option>
            <option value="SOLD">판매완료</option>
          </Form.Select>
        </div>

        {/* 검색 폼 */}
        <div className="list-searchBox">
          <Form onSubmit={handleSearchSubmit} className="search-form">
            <FormControl
              id="searchBox"
              type="text"
              placeholder="검색어를 입력하세요"
              value={search}
              onChange={handleSearchChange}
            />
            <Button
              type="submit"
              id="search-button"
              variant="outline-secondary"
            >
              <img className="button-text" src="/icon/search.png" />
            </Button>
          </Form>
        </div>
      </div>

      {/* 검색 결과 메시지 */}
      {searchMessage && <div>{searchMessage}</div>}

      <div>
        <div className="product_container">
          {/* 상품 목록 */}
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListPage;
