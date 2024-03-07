import React from "react";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../CSS/ListPage.css";

const ProductItem = (props) => {
  const { id, user, title, price } = props.product;

  return (
    <>
      <Card className="product-card">
        <div className="card-title">
          판매자 {user}
          </div>
        <Card.Body>
          {/* 링크를 클릭하면 해당 상품의 상세 페이지로 이동 */}
          <Link to={`/product/detail/${id}`}>
            <Card.Img
              variant="top"
              src="/icon/search.png"
              className="card-img"
            />
          </Link>
        </Card.Body>
        <ListGroup>
          <ListGroupItem className="product-title">{title}</ListGroupItem>
          <ListGroupItem className="price">{price} 원</ListGroupItem>
        </ListGroup>
      </Card>
    </>
  );
};

export default ProductItem;
