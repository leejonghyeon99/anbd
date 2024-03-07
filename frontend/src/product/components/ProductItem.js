import React from "react";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../CSS/ListPage.css"

const ProductItem = (props) => {
  const { id, user, title, price } = props.product;

  return (
    <>
      <Card style={{ fontFamily: "IBMPlexSansKR-Regular", padding: "1rem"}}>
        <Card.Title 
        style={{ fontSize: "75%", margin: "2%", textAlign: "right"}}>
          판매자 [ {user} ]
          </Card.Title>
        <Card.Body>
          {/* 링크를 클릭하면 해당 상품의 상세 페이지로 이동 */}
          <Link to={`/product/detail/${id}`}>
            <Card.Img
              variant="top"
              src="/icon/search.png"
              style={{ width: "90%", height: "auto",  margin: "0 auto", textAlign: "center", border: "solid 1px"}}
            />
          </Link>
        </Card.Body>
        <ListGroup>
          <ListGroupItem className="title">{title}</ListGroupItem>
          <ListGroupItem className="price">{price} 원</ListGroupItem>
        </ListGroup>
      </Card>
    </>
  );
};

export default ProductItem;
