import React from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';

const ProductItem = (props) => {

  const {id, title, price} = props.product;

  return (
    <>
      <Card.Title>판매자ID</Card.Title>
      <Card>
        <Card.Body>
          <Card.Img variant="top" src="./logo.svg"/>
        </Card.Body>
        <ListGroup>
          <ListGroupItem>Title</ListGroupItem>
          <ListGroupItem>가격 Price</ListGroupItem>
        </ListGroup>
      </Card>
    </>
  );
};

export default ProductItem;