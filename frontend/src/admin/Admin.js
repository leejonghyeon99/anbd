
import React from "react";
import UserList from './component/UserList';
import './css/admin.css';
import './Admin.css'
import { Container } from "react-bootstrap";

const Admin = () => {
  return (
    <>
    <div className='bucket'>
                <UserList/>
         </div>
      <div className="container">
        <div className="no1">1CC</div>
        <div className="no2">2CC</div>
        <div className="no3">3CC</div>
        <div className="no4">4CC</div>
      </div>
    </>
  );

};

export default Admin;
