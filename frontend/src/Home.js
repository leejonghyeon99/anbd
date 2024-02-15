import React, { useEffect } from "react";
// import "./common/CSS/Home.css";
import Header from "./common/Header";
// import Sidebar from "./common/Sidebar";
import { useMediaQuery } from "react-responsive";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./user/Login";
import { Container } from "react-bootstrap";
import Admin from "./admin/Admin";
// import WritePage from "./product/page/WritePage";
// import ListPage from "./product/page/ListPage";
// import DetailPage from "./product/page/DetailPage";
// import UpdatePage from "./product/page/UpdatePage";
import ChatPage from "./chat/page/ChatPage";


const Home = () => {


    const isMobile = useMediaQuery({ maxWidth: 768 });

    return (

        <div className="home">
            <Header className="header" />
            <div className="content">
                {!isMobile && (
                    <div className="menu">
                        {/*<Sidebar />*/}
                    </div>
                )}
                <div className="main-content">
                    <Routes>
                        <Route path='/' element={<Navigate to="/home"></Navigate>}></Route>
                        <Route path="/login" Component={Login}></Route>
                        <Route path="/admin" Component={Admin}></Route>

                        {/*<Route path="/product/write" Component={WritePage}></Route>*/}
                        {/*<Route path="/product/list" Component={ListPage}></Route>*/}
                        {/*<Route path="/product/detail/:id" Component={DetailPage}></Route>*/}
                        {/*<Route path="/product/update/:id" Component={UpdatePage}></Route>*/}
                        <Route path="/chat" Component={ChatPage}></Route>
                    </Routes>
                </div>
            </div>
        </div>

    );
};

export default Home;