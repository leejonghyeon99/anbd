import React, { useEffect, useState } from 'react';
import { Button, Card, Form, ListGroup, ListGroupItem } from 'react-bootstrap';
import ProductItem from '../components/ProductItem';
import { useNavigate, useParams } from 'react-router-dom';

const ListPage = () => {

  const navigate = useNavigate();


  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product/list`)
    .then(response => response.json())
    .then(data => {
      setProducts(data)
    });
  }, []);

  const WriteOk = () => {
    navigate("/product/write");
  }

  const submitSearch = (e) => {
    setSearch(e.target.value)
}

  return (
    <div>
      <h2>판매 목록</h2>
      <hr/>
      <Form>
      <input
      type="text" 
      value={search} 
      onChange={submitSearch} />
      </Form>
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