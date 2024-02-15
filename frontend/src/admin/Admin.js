import React from "react";
import "./css/admin.css";
import "./Admin.css";
import { Container } from "react-bootstrap";
import DailySignUp from "./component/DailySignUp";
import MonthSignUp from "./component/MonthSignUp";

const Admin = () => {
  return (
    <>
      {/* <div>
        <DailySignUp/>
        <MonthSignUp/>
      </div> */}
      <div className="container">
        <div className="no1">
          <DailySignUp />
        </div>
        <div className="no2">
          <MonthSignUp />
        </div>
        <div className="no3">3CC</div>
        <div className="no4">4CC</div>
      </div>
    </>
  );
};

export default Admin;
