import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ProductItem from "../components/ProductItem";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Space } from "antd";
const { Search } = Input;

const ListPage = () => {
  const navigate = useNavigate();

  const { category } = useParams();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const productList = async () => {
      try {
        const url = `${apiUrl}/api/product/list/${category}?search=${search}`;

        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
      } catch {
        return null;
      }
    };

    productList();
  }, [search]);

  
  useEffect(() => {
    console.log(products);
  }, [products]);
  // 검색어가 변경될 때마다 필터링된 상품 목록을 업데이트
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  const WriteOk = () => {
    navigate("/product/write");
  };

  return (
    <div>
      <h2>판매 목록</h2>
      <hr />
      <Form>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={search}
          onChange={handleSearchChange}
        />
      </Form>
      {/* 검색 결과가 있을 때만 보여줌 */}
      {/* <div>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))
          ) : (
            <div>검색 결과가 없습니다.</div>
          )}
        </div> */}
      {/* 전체 상품 목록 또는 검색 결과에 따라 보여줌 */}
      {/* {filteredProducts.length === 0
        ? products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))
        : null} */}
      <Button variant="outline-dark mt-3" onClick={WriteOk}>
        상품 등록
      </Button>
    </div>
  );
};

export default ListPage;
// import React, { useEffect, useState } from "react";
// import { Button, Card, Form, ListGroup, ListGroupItem } from "react-bootstrap";
// import ProductItem from "../components/ProductItem";
// import { useNavigate, useParams } from "react-router-dom";
// import { AudioOutlined } from "@ant-design/icons";
// import { Input, Space } from "antd";
// const { Search } = Input;

// const ListPage = () => {
//   const navigate = useNavigate();

//   const [products, setProducts] = useState([]);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product/list`)
//       .then((response) => response.json())
//       .then((data) => {
//         setProducts(data);
//       });
//   }, []);

//   const WriteOk = () => {
//     navigate("/product/write");
//   };

//   const filterTitle = products.filter((p) => {
//     return p.title
//       .replace(" ", "")
//       .toLocaleLowerCase()
//       .includes(search.toLocaleLowerCase().replace(" ", ""));
//   });
//   //검색어 submit
//   const submitSearch = (e) => {
//     setSearch(e.target.value);
//   };

//   return (
//     <div>
//       <h2>판매 목록</h2>
//       <hr />
//       <Form>
//         <input type="text" value={search} onChange={submitSearch} />
//         <div>
//           {filteredProducts.length > 0 ? (
//             filteredProducts.map((product) => (
//               <div key={product.id}>
//                 <span>{product.title}</span>
//               </div>
//             ))
//           ) : (
//             <div>검색 결과가 없습니다.</div>
//           )}
//         </div>
// {/* <Card.Title>판매자ID</Card.Title>
// <Card>
//   <Card.Body>
//     <Card.Img variant="top" src="./logo.svg"/>
//   </Card.Body>
//   <ListGroup>
//     <ListGroupItem>Title</ListGroupItem>
//     <ListGroupItem>가격 Price</ListGroupItem>
//   </ListGroup>
// </Card> */}
//       </Form>
//       {products.map((product) => (
//         <ProductItem key={product.id} product={product} />
//         ))}
//       <Button variant="outline-dark mt-3" onClick={WriteOk}>
//         상품 등록
//       </Button>
//     </div>
//   );
// };

// export default ListPage;
