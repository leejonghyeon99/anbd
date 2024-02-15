import React, { useEffect, useState } from 'react';
import { Button, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import ProductItem from '../components/ProductItem';
import { useNavigate, useParams } from 'react-router-dom';

const ListPage = () => {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/product/list")
    .then(response => response.json())
    .then(data => {
      setProducts(data)
    });
  }, []);

  const WriteOk = () => {
    navigate("/product/write");
  }

  return (
    <div>
      <h2>판매 목록</h2>
      <hr/>
      {/* <Card.Title>판매자ID</Card.Title>
      <Card>
        <Card.Body>
          <Card.Img variant="top" src="./logo.svg"/>
        </Card.Body>
        <ListGroup>
          <ListGroupItem>Title</ListGroupItem>
          <ListGroupItem>가격 Price</ListGroupItem>
        </ListGroup>
      </Card> */}
      {products.map(product => <ProductItem key={product.id} product={product}/>)}
      <Button variant='outline-dark mt-3' onClick={WriteOk}>상품 등록</Button>
    </div>
  );
};

export default ListPage;