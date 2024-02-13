import React, { useEffect } from "react";
import "./common/CSS/Home.css";
import Header from "./common/Header";
import Sidebar from "./common/Sidebar";
import { useMediaQuery } from "react-responsive";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./user/Login";
import { Container } from "react-bootstrap";
import Admin from "./admin/Admin";


const Home = () => {
  

  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (

      <div className="home">
        <Header className="header" />
        <div className="content">
          {!isMobile && (
            <div className="menu">
              <Sidebar />
            </div>
          )}
          <div className="main-content">
            <Routes>
            <Route path='/' element={<Navigate to="/home"></Navigate>}></Route>
              <Route path="/login" Component={Login}></Route>
              <Route path="/admin" Component={Admin}></Route>
            </Routes>
          </div>
        </div>
      </div>

  );
};

export default Home;
