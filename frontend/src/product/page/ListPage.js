import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ProductItem from "../components/ProductItem";
import { useNavigate, useParams } from "react-router-dom";

const ListPage = () => {
  const navigate = useNavigate();

  const { sub } = useParams();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchMessage, setSearchMessage] = useState("");

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
      const filteredProducts = data.filter((product) =>
        product.title.includes(search)
      );

      // 결과가 없을 때 빈 목록으로 설정
      if (filteredProducts.length === 0) {
        // 검색 결과가 없다는 메시지를 사용자에게 알리기
        setSearchMessage("검색된 목록이 없습니다.");
      } else {
        setSearchMessage(""); // 결과가 있으면 메시지 초기화
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  // 새 상품 등록 페이지로 이동하는 함수
  const WriteOk = () => {
    navigate("/product/write");
  };

  return (
    <div>
      <h2> {sub} 판매 목록</h2>
      <hr />
      {/* 검색 폼 */}
      <Form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={search}
          onChange={handleSearchChange}
        />
      <Button type="submit">검색</Button>
      </Form>

      {/* 검색 결과 메시지 */}
      {searchMessage && <div>{searchMessage}</div>}

      {/* 상품 목록 */}
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}

      {/* 상품 등록 버튼 */}
      <Button variant="outline-dark mt-3" onClick={WriteOk}>
        상품 등록
      </Button>
    </div>
  );
};

export default ListPage;
