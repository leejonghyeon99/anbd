import React, { useEffect } from "react";
import "./common/CSS/Home.css";
import Header from "./common/Header";
import Sidebar from "./common/Sidebar";
import { useMediaQuery } from "react-responsive";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./user/Login";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/home");
  }, []);

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
              <Route path="/"></Route>
              <Route path="/login" Component={Login}></Route>
            </Routes>
          </div>
        </div>
      </div>

  );
};

export default Home;
