import React from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';

const ProductItem = (props) => {

  const {id, user, title, price} = props.product;

  return (
    <>
      <Card.Title>판매자ID {user}</Card.Title>
      <Card>
        <Card.Body>
          <Card.Img variant="top" src="./logo.svg"/>
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