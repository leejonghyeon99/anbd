import React from "react";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../CSS/ListPage.css";

const ProductItem = (props) => {
  const { id, user, title, price } = props.product;

  return (
    <>
      <Card id="product-card">
        <div className="card-title">
          판매자 {user}
          </div>
        <Card.Body>
          {/* 링크를 클릭하면 해당 상품의 상세 페이지로 이동 */}
          <Link to={`/product/detail/${id}`} className="moveToDetail">
            <Card.Img
              variant="top"
              src="/icon/search.png"
              className="card-img"
            />
          </Link>
        </Card.Body>
        <ListGroup>
        <Link to={`/product/detail/${id}`} id="moveToDetail">
          <ListGroupItem className="product-title">{title}</ListGroupItem>
          </Link>
          <Link to={`/product/detail/${id}`} id="moveToDetail">
          <ListGroupItem className="price">{price} 원</ListGroupItem>
          </Link>
        </ListGroup>
      </Card>
    </>
  );
};

export default ProductItem;
