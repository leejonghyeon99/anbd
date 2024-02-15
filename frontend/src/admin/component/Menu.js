import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const Dashboard = () => <div>대쉬보드 컴포넌트</div>;
const Users = () => <div>유저 목록 컴포넌트</div>;
const Products = () => <div>상품 목록 컴포넌트</div>;
const Categories = () => <div>카테고리 관리 컴포넌트</div>;
const Reports = () => <div>신고 관리 컴포넌트</div>;

const Menu = () => {
    return (
        <Router>
            <div>
                <ul>
                    <li><Link to="/dashboard">대쉬보드</Link></li>
                    <li><Link to="/users">유저 목록</Link></li>
                    <li><Link to="/products">상품 목록</Link></li>
                    <li><Link to="/categories">카테고리 관리</Link></li>
                    <li><Link to="/reports">신고 관리</Link></li>
                </ul>

                <hr />

                <Route path="/dashboard" component={Dashboard} />
                <Route path="/users" component={Users} />
                <Route path="/products" component={Products} />
                <Route path="/categories" component={Categories} />
                <Route path="/reports" component={Reports} />
            </div>
        </Router>
    );
};

export default Menu;
