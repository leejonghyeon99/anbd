import React from "react";
import "./App.css";
import Header from "./common/Header";
import Sidebar from "./common/Sidebar";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./user/Login";
import Admin from "./admin/Admin";
import Update from "./user/Update";
import SignUp from "./user/SignUp";

const App = () => {

  return (
    <>
      <Header className="header" />
      <div className="menu">
        <Sidebar />
      </div>
      <div className="content">content
          <Routes>
            <Route path="/" element={<Navigate to="/home"></Navigate>}></Route>
            <Route path="/login" Component={Login}></Route>
            <Route path="/signup" Component={SignUp}></Route>
            <Route path="/update" Component={Update}></Route>

            <Route path="/admin" Component={Admin}></Route>
          </Routes>
      </div>
    </>
  );
};

export default App;
