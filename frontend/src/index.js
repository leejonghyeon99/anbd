import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { BrowserRouter } from "react-router-dom";

import App from './App';
import reportWebVitals from './reportWebVitals';
import WritePage from './product/page/WritePage';

import 'bootstrap/dist/css/bootstrap.min.css';
import ProductApp from './product/ProductApp';
import UpdatePage from './product/page/UpdatePage';
import DetailPage from './product/page/DetailPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <ProductApp />
    {/* <DetailPage/> */}
    {/* <UpdatePage/> */}
  </BrowserRouter>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
