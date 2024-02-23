import React, { useState } from "react";
import "./Admin.css";
import { Button, Container } from "react-bootstrap";
import DailySignUp from "./component/DailySignUp";
import MonthSignUp from "./component/MonthSignUp";
import UserList from "./component/UserList";
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
        <div className="admin-menu">
          <Menu />
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

          <div onClick={(e) => e.stopPropagation()}>
            
              {!modalToggle && (
                <Button
                  onClick={() => {
                    setModalToggle(!modalToggle);
                  }}
                >
                  카테고리 관리
                </Button>
              )}
              {modalToggle && (
                <div className="admin-category">
                  <Category setModalToggle={setModalToggle} />
                </div>
              )}

          </div>
        </div>
        
      </div>
    </>
  );
};

export default Admin;
