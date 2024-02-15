import React from "react";
import "./css/admin.css";
import "./Admin.css";
import { Container } from "react-bootstrap";
import DailySignUp from "./component/DailySignUp";
import MonthSignUp from "./component/MonthSignUp";
import UserList from "./component/UserList";
import Menu from "./component/Menu";

const Admin = () => {
  return (
    <>
      <div className="admin-wrapper">
        <div className="admin-menu">
          <Menu/>
        </div>

        <div className="admin-content">
          <DailySignUp/>
          <MonthSignUp/>
          <UserList/>
        </div>
      </div>
    </>
  );

};

export default Admin;
