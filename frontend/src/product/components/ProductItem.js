import React from "react";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductItem = (props) => {
  const { id, user, title, price } = props.product;

  return (
    <>
      <Card.Title>판매자ID {user}</Card.Title>
      <Card>
        <Card.Body>
          {/* 링크를 클릭하면 해당 상품의 상세 페이지로 이동 */}
          <Link to={`/product/detail/${id}`}>
            <Card.Img 
            variant="top" 
            src="/icon/search.png"
            style={{ width: "50px", height: "50px" }}
             />
          </Link>
        </Card.Body>
        <ListGroup>
          <ListGroupItem>Title : {title}</ListGroupItem>
          <ListGroupItem>Price : {price}</ListGroupItem>
        </ListGroup>
      </Card>
    </>
  );
};

export default ProductItem;
