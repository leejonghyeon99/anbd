import logo from "./logo.svg";
import "./CSS/App.css";
import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Home from "./Home";
import Login from "./user/Login";
import Header from "./common/Header";
import ListPage from "./product/page/ListPage";
import WritePage from "./product/page/WritePage";
import DetailPage from "./product/page/DetailPage";
import UpdatePage from "./product/page/UpdatePage";
import Admin from "./admin/Admin";


const App = () => {
  const navigate = useNavigate();

  //   useEffect(() => {
  //       navigate('/home');
  //   },[]);

  return (
    <div>
      <Container className="mt-3">
        <Header />
        <Routes>
          <Route>
            <Route path="/"></Route>
            <Route path="/home" Component={Home}></Route>
            <Route path="/login" Component={Login}></Route>
            <Route path="/admin" Component={Admin}></Route>
            <Route path="/api/product/list" Component={ListPage}></Route>
            <Route path="/api/product/write" Component={WritePage}></Route>
            <Route path="/api/product/detail:id" Component={DetailPage}></Route>
            <Route path="/api/product/update:id" Component={UpdatePage}></Route>
          </Route>
        </Routes>
      </Container>
    </div>
  );
};

export default App;
