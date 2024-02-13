import React, { useEffect } from "react";
import "./common/CSS/Home.css";
import Header from "./common/Header";
import Sidebar from "./common/Sidebar";
import { useMediaQuery } from "react-responsive";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from './user/Login';
import SignUp from './user/SignUp';
import Update from './user/Update';
import { Container } from "react-bootstrap";
import PasswordCheck from "./user/PasswordCheck";


const Home = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   navigate("/home");
  // }, []);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <Container>
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

              <Route path='/login' Component={Login}></Route>
              <Route path='/signup' Component={SignUp}></Route>
              <Route path='/passwordcheck' Component={PasswordCheck}></Route>
              <Route path='/update' Component={Update}></Route>


            </Routes>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Home;
