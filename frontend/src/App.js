import React from "react";
import "./App.css";
import Header from "./common/Header";
import Sidebar from "./common/Sidebar";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./user/Login";
import Admin from "./admin/Admin";
import Update from "./user/Update";
import SignUp from "./user/SignUp";
import Home from "./common/Home";
import { Container } from "react-bootstrap";
import PasswordCheck from "./user/PasswordCheck";

const App = () => {
  return (
    <>
      <div className="AppBox">
        <Header className="header" />
        <div className="menu">
          <Sidebar />
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/home"></Navigate>}></Route>
            <Route path="/home" Component={Home}></Route>
            <Route path="user/login" Component={Login}></Route>
            <Route path="user/signup" Component={SignUp}></Route>
            <Route path="user/passwordcheck" Component={PasswordCheck}></Route>
            <Route path="user/update" Component={Update}></Route>

            <Route path="/product/list" Component={ListPage}></Route>
            <Route path="/product/write" Component={WritePage}></Route>
            <Route path="/product/detail:id" Component={DetailPage}></Route>
            <Route path="/product/update:id" Component={UpdatePage}></Route>
            <Route path="/admin" Component={Admin}></Route>
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
