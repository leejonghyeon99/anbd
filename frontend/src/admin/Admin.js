import React, { useState } from "react";
import "./Admin.css";
import { Button, Container } from "react-bootstrap";
import DailySignUp from "./component/DailySignUp";
import MonthSignUp from "./component/MonthSignUp";
import UserList from "./component/UserList";
import BlockList from "./component/BlockList";
import Menu from "./component/Menu";
import Category from "./component/Category";

const Admin = () => {
  const [modalToggle, setModalToggle] = useState(false);

  return (
    <>
      <div
        className={`admin-wrapper ${modalToggle ? "modalBackground" : ""}`}
        onClick={() => setModalToggle(false)}
      >
        {/* <div className="admin-menu">
          <Menu />
        </div> */}

        <div className="admin-content">

          <div onClick={(e) => e.stopPropagation()}>
            
              {!modalToggle && (
                <Button
                  onClick={() => {
                    setModalToggle(!modalToggle);
                  }}
                  id="admin-categoryBtn"
                >
                  카테고리 관리
                </Button>
              )}
              {modalToggle && (
                <div className="admin-category">
                  <Category setModalToggle={setModalToggle} />
                </div>
              )}
          <div className="admin-chart">
            <div><DailySignUp/></div>
            <div><MonthSignUp/></div>
          </div>
          
          <div className="admin-user-list">
            <div className="list"><UserList/></div>
            <div className="list"><BlockList/></div>
          </div>

          </div>
        </div>
        
      </div>
    </>
  );
};

export default Admin;
