import React from "react";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../CSS/ListPage.css";

const ProductItem = (props) => {
  const { id, user, title, price, fileList} = props.product;
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  return (
    <>
      <Card id="product-card">
        <div className="card-user">
          <small>작성자-</small>  {user}
        </div>

          {/* 링크를 클릭하면 해당 상품의 상세 페이지로 이동 */}
          <Link to={`/product/detail/${id}`} className="moveToDetail">
            {/* <Card.Img
              src="https://news.samsungdisplay.com/wp-content/uploads/2018/08/8.jpg"
              className="card-img"
            /> */}
            {/* {fileList.map((productImage) => (
            <Card.Img
              key={productImage.filename}
              src={`/upload/product/${productImage.filename}`}
              className="img-thumbnail"
              alt="upload-img"
            />
          ))} */}
           <ul className="list-group mb-1">
            {fileList.length > 0 ? (
              <li>
                <img
                  src={`${apiUrl}/upload/product/${fileList[0].photoName}`}
                  className="img"
                  alt="상품 이미지"
                />
              </li>
            ) : (
              <li>
                <img
                  src={`${apiUrl}/upload/product/NoImage.png`}
                  className="img"
                  alt="이미지 없음"
                />
              </li>
            )}
          </ul>
          </Link>
        <ListGroup>
          <Link to={`/product/detail/${id}`} id="moveToDetail">
            <ListGroupItem id="product-title" >{title}</ListGroupItem>
          </Link>
          <Link to={`/product/detail/${id}`} id="moveToDetail">
            <ListGroupItem id="price">{price} 원</ListGroupItem>
          </Link>
        </ListGroup>
      </Card>
    </>
  );
};

export default ProductItem;
