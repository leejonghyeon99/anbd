import React from "react";
import './Admin.css';
import { Container } from "react-bootstrap";
import DailySignUp from "./component/DailySignUp";
import MonthSignUp from "./component/MonthSignUp";
import UserList from "./component/UserList";
import Menu from "./component/Menu";
import Category from "./component/Category";

const Admin = () => {
  return (
    <>
      <div className="admin-wrapper">
        <div className="admin-menu">
          <Menu/>
        </div>

        <div className="admin-content">
          {/* <div className="admin-chart">
            <DailySignUp/>
          </div>
          <div className="admin-chart">
            <MonthSignUp width={800} height={200}/>
          </div>
          <div className="admin-user-list">
            <UserList/>
          </div> */}
          <div className="admin-category">
            <Category/>
          </div>

        </div>
      </div>
    </>
  );

};

export default Admin;
