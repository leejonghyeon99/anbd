import React from 'react';
import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import ListPage from './page/ListPage';
import WritePage from './page/WritePage';
import UpdatePage from './page/UpdatePage';
import DetailPage from './page/DetailPage';

const ProductApp = () => {
  return (
    <>
      <Container>
        <Routes>
          <Route path='/' Component={ListPage}></Route>
          <Route path='/product/list' Component={ListPage}></Route>
          <Route path='/product/write' Component={WritePage}></Route>
          <Route path='/product/detail:id' Component={DetailPage}></Route>
          <Route path='/product/update:id' Component={UpdatePage}></Route>
        </Routes>
      </Container>
    </>
  );
};

export default ProductApp;